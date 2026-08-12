import { useCallback, useMemo } from "react";
import { useLocalstorage } from "./useLocalStorage";
import type { AircraftCardData } from "../types/aircraftTypes";

export const useAircraftCache = () => {
  const [savedAircraftData, setSavedAircraftData] = useLocalstorage<AircraftCardData[] | Record<string, AircraftCardData>>("aircraft-cache", []);

  const savedAircraft = useMemo(() => {
    return Array.isArray(savedAircraftData)
      ? savedAircraftData
      : Object.values(savedAircraftData);
  }, [savedAircraftData]);

  const handleSaveAircraft = useCallback((aircraft: AircraftCardData) => {
    setSavedAircraftData((prev) => {
      const current = Array.isArray(prev) ? prev : Object.values(prev);
      return current.some((item) => item.id === aircraft.id) ? current : [...current, aircraft];
    });
  }, [setSavedAircraftData]);

  const handleRemoveAircraft = useCallback((aircraftId: string) => {
    setSavedAircraftData((prev) => {
      const current = Array.isArray(prev) ? prev : Object.values(prev);
      return current.filter((aircraft) => aircraft.id !== aircraftId);
    });
  }, [setSavedAircraftData]);

  return {
    savedAircraft,
    handleSaveAircraft,
    handleRemoveAircraft,
  };
};
