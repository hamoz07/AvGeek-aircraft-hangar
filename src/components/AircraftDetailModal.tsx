import { Building2, Gauge, PlaneTakeoff, Ruler, ShieldCheck, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { AircraftDetailsModalData } from "../types/aircraftTypes";

type AircraftDetailModalProps = {
  aircraft: AircraftDetailsModalData | null;
  open: boolean;
  onClose: () => void;
};

const formatValue = (value: number | null, unit: string) => {
  if (value == null) return "--";
  return `${value.toLocaleString()} ${unit}`;
};

export const AircraftDetailModal = ({ aircraft, open, onClose }: AircraftDetailModalProps) => {
  const [animateClass, setAnimateClass] = useState("");
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);    
  }, [onClose, open]);

    useEffect(() => {
    if (open) {
      setAnimateClass("animate__animated animate__slideInUp");
    } else if (!open && animateClass.includes("slideInUp")) {
      setAnimateClass("animate__animated animate__slideOutDown");
      const cleanAnimateClass = () => setAnimateClass("");
      const timer = setTimeout(cleanAnimateClass, 3000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open || !aircraft) return null;

  return (
    <div
      className={`aircraft-modal-overlay fixed inset-0 z-50 grid place-items-center px-4 py-6`}
      role="presentation"
      onClick={onClose}
    >
      <section
        className={`aircraft-modal-panel ${animateClass}  w-full max-w-2xl rounded-[1.5rem] border p-5 shadow-2xl sm:p-6`}
        role="dialog"
        aria-modal="true"
        aria-label={`${aircraft.modelName} details`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--text-soft)">
              Aircraft Details
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-(--text-main)">
              {aircraft.modelName} <span className="text-(--text-soft) text-sm font-normal">In Your Hangar</span>
            </h2>
            <p className="mt-1 text-sm font-medium text-(--text-muted)">
              {aircraft.manufacturer}
            </p>
          </div>

          <button
            type="button"
            className="glass-icon-btn text-(--text-muted)"
            aria-label="Close aircraft details"
            title="Close aircraft details"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="glass-stat">
            <span className="glass-stat-label">
              <PlaneTakeoff size={14} /> Max speed
            </span>
            <p className="glass-stat-value">{formatValue(aircraft.maxSpeedKnots, "kt")}</p>
          </div>
          <div className="glass-stat">
            <span className="glass-stat-label">
              <Gauge size={14} /> Max range
            </span>
            <p className="glass-stat-value">{formatValue(aircraft.rangeNauticalMiles, "nm")}</p>
          </div>
          <div className="glass-stat">
            <span className="glass-stat-label">
              <Ruler size={14} /> Wingspan
            </span>
            <p className="glass-stat-value">{formatValue(aircraft.wingSpanFt, "ft")}</p>
          </div>
          <div className="glass-stat">
            <span className="glass-stat-label">
              <Building2 size={14} /> Length
            </span>
            <p className="glass-stat-value">{formatValue(aircraft.lengthFt, "ft")}</p>
          </div>
          <div className="glass-stat">
            <span className="glass-stat-label">
              <ShieldCheck size={14} /> Ceiling
            </span>
            <p className="glass-stat-value">{formatValue(aircraft.ceilingFt, "ft")}</p>
          </div>
          <div className="glass-stat">
            <span className="glass-stat-label">
              <Users size={14} /> Gross weight
            </span>
            <p className="glass-stat-value">{formatValue(aircraft.grossWeightLbs, "lbs")}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--glass-border)] bg-white/20 p-4 text-sm text-(--text-muted) dark:bg-slate-950/30">
          <p className="font-semibold text-(--text-main)">Engine spec</p>
          <p className="mt-1">{aircraft.engineType}</p>
          
        </div>
      </section>
    </div>
  );
};