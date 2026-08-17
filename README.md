# Avgeek Aircraft Search & Hangar

> A feature‑rich, TypeScript‑only React app that lets users search for aircraft, inspect specs, and pin them to a personal “hangar”.
>
> Built with **Vite + React + ESLint + Tailwind CSS**, it demonstrates modern component patterns, performance‑oriented hooks, and thoughtful UX.
>
> fast lookup, keyboard accessibility, and persistent storage (results cached (LRU+TTL) + localStorage) are all implemented in a small, self‑contained codebase.

## 🚀 Key Features

| Feature | What it Does | Where it Lives |
|---------|--------------|----------------|
| **Instant Search** | Real‑time, debounced lookup (3+ chars required) that shows results as you type. | `src/hooks/useAircraftSearch.ts` + `src/components/SearchAircraft.tsx` |
| **Search Results** | Accessible list that highlights matches, supports keyboard navigation, and triggers add‑to‑hangar actions. | `src/components/SearchResults.tsx` + `src/hooks/useKeyboardNav.ts` |
| **Hangar** | Persisted list of favorite aircraft. Items are cached in Indexed‑DB (LRU‑TTL) and user settings live in `localStorage`. | `src/hooks/useAircraftCache.ts` + `src/hooks/useLocalStorage.ts` |
| **Aircraft Modal** | Full spec view that opens inline, with delete capability. | `src/components/AircraftDetailModal.tsx` |
| **Infinite Loading** | Lazy “load‑more” of saved aircraft via IntersectionObserver and debounced timeout. | `src/utils/createEndReachedObserver.ts` |
| **Theme Toggle** | Light/Dark mode auto‑detection, persistence, and dynamic CSS variable injection. | `src/hooks/useLocalStorage.ts` + `src/App.tsx` |
| **Sticky Header** | Header becomes translucent and fixed once scrolled past a sentinel div. | `src/components/Header.tsx` |
| **Keyboard Accessibility** | Global shortcuts for search focus, arrow‑navigation, and theme toggle. | `src/hooks/useKeyboardNav.ts` |

## 📦 React Design Patterns

| Pattern | Implementation |
|---------|----------------|
| **Refs + ForwardRef** | `AircraftCard` is a forward‑ref component so the parent can track when each card renders (used for infinite scroll). |
| **LayoutEffect for Scroll Control** | In `src/App.tsx` a `useLayoutEffect` disables native scroll restoration and scrolls to top on mount. |
| **IntersectionObserver helpers** | `createIntersectionObserver` returns a disconnect function; every observer is cleaned up, avoiding memory leaks. |
| **State + Ref sync** | `useRef` stores the latest value of async flags (`isLoadingMoreHangarRef`) so callbacks can read the current state. |
| **Memoized Sub‑List** | `useMemo` slices the hangar array for pagination and maintains reverse order for “most recently added first.” |
| **Conditional Rendering** | Search results show only when query ≥ 3 and data isn’t stale, preventing unnecessary re‑renders. |
| **Accessible Buttons** | All actionable UI uses aria‑labels and keyboard event handling (Enter / Space). |

## Development run steps

- **TypeScript** – strict configuration with ESLint + typed lint rules.  
- **Build** – `vite build` → `dist/`.  
- **No tests** – this repo is a curated demo for showcase.  
- **Accessibility** – keyboard navigation and visual focus styling are fully WCAG‑compliant.  

## Quick Start

```bash
$ npm i
$ npm run dev   # Vite dev server
```

---

**What I learned**

- practiced mastery over React hooks, state management, and performance patterns.  
- practiced how to architect a complex‑interaction app while keeping code readable and maintainable.  
- Used modern tooling (Vite, TS, ESLint, Tailwind) and detailed documentation for rapid onboarding.
