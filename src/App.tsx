import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createIntersectionObserver } from "./utils/createEndReachedObserver";
import Header from "./components/Header";
import SearchAircraft from "./components/SearchAircraft";
import SearchResults from "./components/SearchResults";
import { AircraftCard } from "./components/AircraftCard";
import { AircraftDetailModal } from "./components/AircraftDetailModal";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useAircraftSearch } from "./hooks/useAircraftSearch";
import { useKeyboardNav } from "./hooks/useKeyboardNav";
import { useAircraftCache } from "./hooks/useAircraftCache";
import type { AircraftCardData, AircraftDetailsModalData } from "./types/aircraftTypes";
type ThemeMode = "light" | "dark";

function App() {
  const [theme, setTheme] = useLocalStorage<ThemeMode>("aircraft-theme", "dark");
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftDetailsModalData | null>(null);
  const [isLoadingMoreHangar, setIsLoadingMoreHangar] = useState(false);
  const [lastCardMounted, setLastCardMounted] = useState(0);
  const [visibleCount, setVisibleCount] = useState(10);
  const myULref = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastOne = useRef<HTMLElement | null>(null);
  const hasUserScrolledRef = useRef(false);
  const isLoadingMoreHangarRef = useRef(isLoadingMoreHangar);
  const [isSticky, setIsSticky] = useState(false);
  const {
    savedAircraft,
    handleSaveAircraft,
    handleRemoveAircraft,
  } = useAircraftCache();
  const {
    query,
    setQuery,
    isStale,
    isSearching,
    baseSearchResults,
    renderedSearchResults,
  } = useAircraftSearch();

  const displayedHangar = useMemo(() => [...savedAircraft].reverse(), [savedAircraft]);
  const visibleHangar = useMemo(() => displayedHangar.slice(0, visibleCount), [displayedHangar, visibleCount]);
  const hasMoreHangar = visibleCount < displayedHangar.length;

  const selectedAircraftIds = new Set(displayedHangar.map((aircraft) => aircraft.id));
  const activeAircraft = displayedHangar[0];
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 10, displayedHangar.length));
  }, [displayedHangar.length]);

  const handleAddAircraft = useCallback((aircraft: AircraftCardData) => {
    handleSaveAircraft(aircraft);
    setSelectedAircraft(aircraft);
    setQuery("");
  }, [handleSaveAircraft, setQuery]);

  const handleDeleteAircraft = useCallback((id: string) => {
    handleRemoveAircraft(id);
    setSelectedAircraft((current) => (current?.id === id ? null : current));
  }, [handleRemoveAircraft]);

  const handleOpenAircraftDetails = useCallback((aircraft: AircraftCardData) => {
    setSelectedAircraft(aircraft);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedAircraft(null);
  }, []);

  const lastOneCallbackRef = useCallback((node: HTMLElement | null) => {
    lastOne.current = node;
    if (node) setLastCardMounted((current) => current + 1);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((c) => (c === "light" ? "dark" : "light"));
  }, [setTheme]);

  const { activeProp } = useKeyboardNav({
    renderedSearchResults,
    query,
    selectedAircraftIds,
    onAddAircraft: handleAddAircraft,
    listRef: myULref,
  });

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    isLoadingMoreHangarRef.current = isLoadingMoreHangar;
  }, [isLoadingMoreHangar]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 0) hasUserScrolledRef.current = true;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setVisibleCount((current) => {
      const clamped = Math.min(current, displayedHangar.length);
      if (displayedHangar.length === 0) return 10;
      return Math.max(10, clamped);
    });
  }, [displayedHangar.length]);

  useEffect(() => {
    if (!hasMoreHangar) return;
    const target = lastOne.current;
    if (!target) return;

    let timer: number | null = null;
    const disconnect = createIntersectionObserver(
      target,
      () => {
        if (isLoadingMoreHangarRef.current) return;
        if (!hasMoreHangar) return;
        if (!hasUserScrolledRef.current) return;

        isLoadingMoreHangarRef.current = true;
        setIsLoadingMoreHangar(true);

        timer = window.setTimeout(() => {
          console.log("running")
          isLoadingMoreHangarRef.current = false;
          setIsLoadingMoreHangar(false);
          loadMore();
        }, 1200);
      },
      {
        triggerWhen: "enters",
        rootMargin: "160px",
      }
    );

    return () => {
      if (timer !== null) window.clearTimeout(timer);
      disconnect();
    };
  }, [hasMoreHangar, lastCardMounted, loadMore, visibleHangar.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = createIntersectionObserver(sentinel, () => setIsSticky(true), {triggerWhen: "leaves",})

    return () => observer()
  }, []);

  return (
    <div className="app-shell flex flex-col gap-3 sm:gap-4">
      <div ref={sentinelRef} style={{ height: 0 }} />
      <Header activeAircraft={activeAircraft} theme={theme} sticky={isSticky} onToggleTheme={toggleTheme} />
      <SearchAircraft onSearch={setQuery} value={query} />

      {query.length === 0 && !isSearching && (
        <p className="status-text">
          Start typing to search for aircraft.</p>
      )}
      {query.length < 3 && !isSearching && (
        <p className="status-text">Type at least 3 characters to see matches.</p>
      )}

      {query.length >= 3 && (
        <div style={{ opacity: isStale ? 0.4 : 1, transition: "opacity 0.2s" }}>
          <SearchResults
            onSelectAircraft={handleAddAircraft}
            results={renderedSearchResults}
            totalCount={baseSearchResults.length}
            isLoading={isSearching}
            selectedAircraftIds={selectedAircraftIds}
            query={query}
            activeProp={activeProp}
            ref={myULref}
          />
        </div>
      )}

      {displayedHangar.length > 0 && (
        <h2 className="section-title mt-2 text-lg font-semibold">My Hangar</h2>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleHangar.map((aircraft, index, array) => (
          <AircraftCard
            key={aircraft.id}
            aircraft={aircraft}
            onDeleteAircraft={handleDeleteAircraft}
            onOpenDetails={handleOpenAircraftDetails}
            ref={hasMoreHangar && array.length - 1 === index ? lastOneCallbackRef : null}
          />
        ))}

        {isLoadingMoreHangar && (
          <section className="aircraft-card rounded-2xl border p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-(--text-muted)">
              Loading more...
            </div>
          </section>
        )}
      </div>

      {displayedHangar.length === 0 && query.length === 0 && (
        <p className="status-text">Your bucket list hangar is empty. Search aircraft above and add one.</p>
      )}

      <AircraftDetailModal
        open={Boolean(selectedAircraft)}
        aircraft={selectedAircraft}
        onClose={handleClose}
      />
    </div>
  );
}

export default App;