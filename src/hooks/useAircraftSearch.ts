import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { API_BASE_URL, type AircraftApiItem, type AircraftCardData } from "../types/aircraftTypes";
import { LRUTTLCache, type CacheEntry } from "../utils/LRUTTLCache";
import { useLocalStorage } from "./useLocalStorage";

type SerializedCache = [string, CacheEntry<AircraftCardData[]>][];

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const normalizeAircraft = (item: AircraftApiItem, query: string): AircraftCardData => {
  const modelName = item.model?.trim() || "Unknown model";
  const manufacturer = item.manufacturer?.trim() || "Unknown manufacturer";
  const id = String((item.id ?? `${manufacturer}-${modelName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-")) || query);
  return {
    id,
    modelName,
    manufacturer,
    maxSpeedKnots: toNumber(item.max_speed_knots),
    ceilingFt: toNumber(item.ceiling_ft),
    grossWeightLbs: toNumber(item.gross_weight_lbs),
    lengthFt: toNumber(item.length_ft),
    heightFt: toNumber(item.height_ft),
    wingSpanFt: toNumber(item.wing_span_ft),
    rangeNauticalMiles: toNumber(item.range_nautical_miles),
    engineType: item.engine_type?.trim() || "Unknown",
    engineThrustLbFt: toNumber(item.engine_thrust_lb_ft),
  };
};

export const useAircraftSearch = () => {
  const [query, setQuery] = useState("");

const { manufacturer, model } = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return { manufacturer: "", model: "" };
    const parts = trimmed.split(/\s+/);
    const manufacturer = parts[0] || "";
    const model = parts.slice(1).join(" ") || "";
    return { manufacturer, model };
  }, [query]);

  const [aircraft, setAircraft] = useState<AircraftCardData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchVisibleCount, setSearchVisibleCount] = useState(0);
  const [persistedEntries, setPersistedEntries] = useLocalStorage<SerializedCache>(
    "aircraft_search_cache",
    []
  );
  const searchCache = useRef<LRUTTLCache<string, AircraftCardData[]> | null>(null);
  if (!searchCache.current) {
    searchCache.current = new LRUTTLCache<string, AircraftCardData[]>(
      20,
      5 * 60 * 1000,
      persistedEntries
    );
  }

  const deferredAircraft = useDeferredValue(aircraft);
  const isStale = deferredAircraft !== aircraft;

  const baseSearchResults = useMemo(() => deferredAircraft ?? [], [deferredAircraft]);
  const renderedSearchResults = useMemo(() => baseSearchResults.slice(0, searchVisibleCount), [baseSearchResults, searchVisibleCount]);

  useEffect(() => {
    const trimmedMan = manufacturer.toLowerCase().trim();
    const trimmedMod = model.toLowerCase().trim();

    const combinedQuery = [trimmedMan, trimmedMod].filter(Boolean).join(" ");
    if (combinedQuery.length < 3) {
      setIsSearching(false);
      if (combinedQuery.length === 0) setAircraft([]);
      return;
    }

    const cachedChecked = searchCache.current?.get(combinedQuery);
    if (cachedChecked) {
      setAircraft(cachedChecked);
      setIsSearching(false);
      setPersistedEntries(searchCache.current?.toEntries() ?? []);
      return;
    }

    const controller = new AbortController();
    let delayedTimerId: number | undefined;
    const fetchAircraft = async () => {
      setIsSearching(true);
      const loadingStartTime = Date.now();
      try {
        const apiKey = import.meta.env.VITE_API_NINJAS_API_KEY ?? import.meta.env.VITE_API_NINJAS_KEY;
        const queryString = `?${trimmedMan ? `manufacturer=${encodeURIComponent(trimmedMan)}&` : ``}${trimmedMod ? `model=${encodeURIComponent(trimmedMod)}` : ``}&limit=30`;
        const response = await fetch(`${API_BASE_URL}${queryString}`, {
          signal: controller.signal,
          headers: apiKey ? { "X-Api-Key": apiKey, "Content-Type": "application/json" } : undefined,
        });
        if (!response.ok) throw new Error(`Aircraft API request failed with ${response.status}`);
        const data: AircraftApiItem[] = await response.json();
        const normalizedData = Array.isArray(data) ? data.map((item) => normalizeAircraft(item, combinedQuery)) : [];
        searchCache.current?.set(combinedQuery, normalizedData);
        setPersistedEntries(searchCache.current?.toEntries() ?? []);
        setAircraft(normalizedData);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Error fetching aircraft:", error);
        setAircraft([]);
      } finally {
        if (!controller.signal.aborted) {
          const elapsed = Date.now() - loadingStartTime;
          const remaining = Math.max(800 - elapsed, 0);
          delayedTimerId = window.setTimeout(() => setIsSearching(false), remaining);
        }
      }
    };
    fetchAircraft();
    return () => {
      delayedTimerId && window.clearTimeout(delayedTimerId);
      controller.abort();
    };
  }, [manufacturer, model, setPersistedEntries]);



    useEffect(() => {
      const resetTimer = window.setTimeout(() => setSearchVisibleCount(0), 0);
      if (baseSearchResults.length === 0) return () => window.clearTimeout(resetTimer);
      let i = 0;
      const interval = window.setInterval(() => {
        i += 1;
        setSearchVisibleCount(i);
        if (i >= baseSearchResults.length) window.clearInterval(interval);
      }, 60);
      return () => {
        window.clearTimeout(resetTimer);
        window.clearInterval(interval);
      };
    }, [baseSearchResults]);

  return {
    query,
    setQuery,
    aircraft,
    setAircraft,
    isStale,
    isSearching,
    baseSearchResults,
    renderedSearchResults,
  };
};
