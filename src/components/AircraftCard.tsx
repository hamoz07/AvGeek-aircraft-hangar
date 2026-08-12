import { Factory, Gauge, PlaneTakeoff, Trash2 } from "lucide-react";
import { forwardRef } from "react";
import type { AircraftCardData } from "../types/aircraftTypes";

type AircraftCardProps = {
  aircraft: AircraftCardData;
  onDeleteAircraft: (aircraftId: string) => void;
  onOpenDetails: (aircraft: AircraftCardData) => void;
};

const formatValue = (value: number | null, unit: string) => {
  if (value == null) return "--";
  return `${value.toLocaleString()} ${unit}`;
};

export const AircraftCard = forwardRef<HTMLElement, AircraftCardProps>(
  ({ aircraft, onDeleteAircraft, onOpenDetails }, ref) => {
    return (
      <section
        ref={ref}
        className="aircraft-card  rounded-2xl border p-4"
        role="button"
        tabIndex={0}
        onClick={() => onOpenDetails(aircraft)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenDetails(aircraft);
          }
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--text-soft)">
              Bucket List Aircraft
            </p>
            <h3 className="mt-1 truncate text-xl font-extrabold tracking-tight text-(--text-main)">
              {aircraft.modelName}
            </h3>
            <p className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-(--text-muted)">
              <Factory size={14} />
              {aircraft.manufacturer}
            </p>
          </div>

          <button
            type="button"
            className="glass-icon-btn text-(--text-muted)"
            aria-label={`Remove ${aircraft.modelName}`}
            title={`Remove ${aircraft.modelName}`}
            onClick={(event) => {
              event.stopPropagation();
              onDeleteAircraft(aircraft.id);
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="glass-stat">
            <span className="glass-stat-label">
              <PlaneTakeoff size={14} /> Max speed
            </span>
            <p className="glass-stat-value">{formatValue(aircraft.maxSpeedKnots, "kt")}</p>
          </div>
          <div className="glass-stat">
            <span className="glass-stat-label">
              <Gauge size={14} /> Range
            </span>
            <p className="glass-stat-value">{formatValue(aircraft.rangeNauticalMiles, "nm")}</p>
          </div>
        </div>

        <p className="mt-3 text-[0.75rem] font-medium text-(--text-soft)">
          Click to inspect wingspan, engine spec, and cabin capacity.
        </p>
      </section>
    );
  }
);