import { Search, X } from "lucide-react";

type SearchAircraftProps = {
  onSearch: (query: string) => void;
  value: string
};

export default function SearchAircraft({ onSearch, value }: SearchAircraftProps) {
  return (
    <div className="relative w-full">
      <Search
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
        placeholder="Avgeek? Search any aircraft to inspect specs and save to your hangar."
        className="searchAircraft-wrap input-glass w-full rounded-2xl px-11 py-3 pr-12 text-sm font-medium transition-all duration-200"
      />

      {value.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          title="Clear search"
          onClick={() => onSearch("")}
          className="clear-search-btn absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full cursor-pointer"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}