import { useEffect, useRef, useState } from "react";
import { scrollIntoView } from "../utils/checkScrollability";
import type { AircraftCardData } from "../types/aircraftTypes";

type UseKeyboardNavProps = {
  renderedSearchResults: AircraftCardData[];
  query: string;
  selectedAircraftIds: Set<string>;
  onAddAircraft: (aircraft: AircraftCardData) => void;
  listRef: React.RefObject<HTMLUListElement | null>;
};

export const useKeyboardNav = ({
  renderedSearchResults,
  query,
  selectedAircraftIds,
  onAddAircraft,
  listRef,
}: UseKeyboardNavProps) => {
  const [activeProp, setActivProp] = useState(0);

  const renderedResultsRef = useRef(renderedSearchResults);
  const queryRef = useRef(query);
  const activePropRef = useRef(activeProp);
  const selectedAircraftIdsRef = useRef(selectedAircraftIds);
  const onAddAircraftRef = useRef(onAddAircraft);

  useEffect(() => { renderedResultsRef.current = renderedSearchResults; }, [renderedSearchResults]);
  useEffect(() => { queryRef.current = query; }, [query]);
  useEffect(() => { activePropRef.current = activeProp; }, [activeProp]);
  useEffect(() => { selectedAircraftIdsRef.current = selectedAircraftIds; }, [selectedAircraftIds]);
  useEffect(() => { onAddAircraftRef.current = onAddAircraft; }, [onAddAircraft]);

  useEffect(() => {
    const len = renderedSearchResults.length;
    setActivProp((prev) => {
      if (len === 0) return -1;
      if (prev === -1 || prev < 0) { scrollIntoView(0, listRef); return 0; }
      if (prev >= len) { const next = len - 1; scrollIntoView(next, listRef); return next; }
      return prev;
    });
  }, [renderedSearchResults.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const results = renderedResultsRef.current;
      const aircraftCount = results.length;
      if (aircraftCount === 0 || !queryRef.current) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActivProp((prev) => {
          const next = prev === -1 ? 0 : (prev + 1) % aircraftCount;
          scrollIntoView(next, listRef);
          return next;
        });
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActivProp((prev) => {
          const next = prev === -1 ? aircraftCount - 1 : (prev - 1 + aircraftCount) % aircraftCount;
          scrollIntoView(next, listRef);
          return next;
        });
      }

      if (event.key === "Enter") {
        const aircraft = renderedResultsRef.current[activePropRef.current];
        if (!aircraft) return;
        if (selectedAircraftIdsRef.current.has(aircraft.id)) {
          alert("you already added it to your hangar");
          return;
        }
        onAddAircraftRef.current(aircraft);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { activeProp };
};