import { Antenna, Moon, SunMedium } from "lucide-react";
import type { AircraftCardData } from "../types/aircraftTypes";
import { Plane } from 'lucide-react';

type HeaderProps = {
    activeAircraft?: AircraftCardData;
    theme: "light" | "dark";
    onToggleTheme: () => void;
    sticky: boolean
}

const Header = ({ activeAircraft, theme, onToggleTheme, sticky }: HeaderProps) => {
    return (
        <header
            className={`aircraft-header flex items-center justify-between gap-4 sticky z-50 transition-all duration-300 
                        ${sticky ? "shadow-[var(--glass-shadow)] backdrop-blur-[14px] backdrop-saturate-150 top-[5px]"
                    : "shadow-none bg-transparent top-0"
                }`}

        >
            <div className='flex items-center gap-4'>
                <div className='aircraft-icon-wrap'>
                    <Plane size={22} strokeWidth={2.3} />
                </div>
                <div>
                    <h1 className='text-2xl font-extrabold tracking-tight'>AvGeek Aircraft Hangar</h1>
                    <p className='text-sm font-medium tracking-wide text-[var(--text-muted)]'>
                        {activeAircraft ? `${activeAircraft.modelName} • ${activeAircraft.manufacturer}` : "Search aircraft and pin them to your hangar"}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onToggleTheme}
                    className="cursor-pointer flex items-center flex-col text-xs"
                    aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                    title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                >
                    {theme === "light" ? <Moon size={16} /> : <SunMedium size={16} />}
                    <span>{theme === "light" ? "Dark" : "Light"}</span>
                </button>
            </div>
        </header>
    )
}

export default Header