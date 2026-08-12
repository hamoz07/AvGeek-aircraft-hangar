import { Check, LoaderCircle, PlaneTakeoff, Plus } from "lucide-react";
import { useMemo, forwardRef } from "react";
import type { AircraftCardData } from "../types/aircraftTypes";

type SearchResultsProps = {
    results?: AircraftCardData[];
    totalCount?: number;
    isLoading?: boolean;
    query: string;
    selectedAircraftIds?: Set<string>;
    onSelectAircraft?: (aircraft: AircraftCardData) => void;
    activeProp?: number;
};

const SearchResults = forwardRef<HTMLUListElement, SearchResultsProps>(
    ({ results = [], totalCount = 0, isLoading, onSelectAircraft, query, selectedAircraftIds = new Set(), activeProp }, ref) => {
        const selectedInResults = useMemo(() => {
            return results.filter((aircraft) => selectedAircraftIds.has(aircraft.id)).length;
        }, [results, selectedAircraftIds]);

        return (
            <section className="dropdown-panel p-4">
                    {isLoading ? (
                        <p className="inline-flex items-center gap-2 text-sm font-medium text-(--text-muted)">
                            <LoaderCircle size={15} className="animate-spin" />
                            Searching for aircraft matching "{query}"...
                        </p>
                    ) : totalCount > 0 ? (
                        <p className="text-sm font-semibold text-(--text-main)">
                            Found {totalCount} {totalCount === 1 ? "aircraft" : "aircraft"}:
                        </p>
                    ) : (
                        <p className="text-sm font-medium text-(--text-muted)">No aircraft found for "{query}". Try a different query.</p>
                    )}

                    {!isLoading && selectedInResults > 0 && (
                        <p className="text-xs font-semibold text-(--text-muted)">{selectedInResults} already in your hangar</p>
                    )}
                    

                    {!isLoading && results.length > 0 && (
                        <ul className="max-h-72 space-y-1 overflow-auto pr-1" role="listbox" title="Aircraft search results" ref={ref}>
                            {results.map((aircraft, index: number) => {
                                const isSelected = selectedAircraftIds.has(aircraft.id);
                                return (
                                    <li
                                        key={aircraft.id}
                                        className={`animate-[global-rise_420ms_ease-out_both] ${index === activeProp ? "selected" : ""}`}
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <button
                                            type="button"
                                            disabled={isSelected}
                                            className={`aircraft-option ${index === activeProp ? "active" : ""}`}
                                            onClick={() => onSelectAircraft?.(aircraft)}
                                        >
                                            <div className="min-w-0">
                                                <h2 className="aircraft-option-title truncate">{aircraft.modelName}</h2>
                                                <p className="aircraft-option-subtitle truncate">{aircraft.manufacturer}</p>
                                                <p className="aircraft-option-subline">
                                                    <PlaneTakeoff size={12} />
                                                    Max speed {aircraft.maxSpeedKnots ?? "--"} kt • Range {aircraft.rangeNauticalMiles ?? "--"} nm
                                                </p>
                                            </div>
                                            <div className="aircraft-option-right">
                                                {isSelected ? (
                                                    <span className="aircraft-added-badge">
                                                        <Check size={13} />
                                                        Added
                                                    </span>
                                                ) : (
                                                    <Plus size={16} />
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
            </section>
        );
});

export default SearchResults;