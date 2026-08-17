import { Moon, SunMedium, Plane } from "lucide-react";
import type { AircraftCardData } from "../types/aircraftTypes";

type HeaderProps = {
  activeAircraft?: AircraftCardData;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  sticky: boolean;
};

const Header = ({ activeAircraft, theme, onToggleTheme, sticky }: HeaderProps) => {
  return (
    <header
      className={`aircraft-header flex items-center justify-between gap-3 sm:gap-4 sticky z-50 transition-all duration-300 w-full ${
        sticky
          ? "shadow-[var(--glass-shadow)] backdrop-blur-[14px] backdrop-saturate-150 top-[5px]"
          : "shadow-none bg-transparent top-0"
      }`}
    >
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
        <div className="aircraft-icon-wrap shrink-0">
          <Plane className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.3} />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-tight truncate">
            AvGeek Aircraft Hangar
          </h1>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[var(--text-muted)] truncate">
            {activeAircraft
              ? `${activeAircraft.modelName} • ${activeAircraft.manufacturer}`
              : "Search aircraft and pin them to your hangar"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleTheme}
          className="cursor-pointer flex items-center flex-col justify-center text-xs p-1.5 sm:p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/10 active:scale-95"
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
          ) : (
            <SunMedium className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
          <span className="text-[10px] sm:text-xs mt-0.5">{theme === "light" ? "Dark" : "Light"}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;