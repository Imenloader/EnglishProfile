# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2026-05-10 - Scroll Event Parent Re-rendering
**Learning:** `src/app/page.tsx` was tracking scroll progress at the root level using `useState` and a `requestAnimationFrame` throttled scroll listener. While the throttling was good, every scroll event triggered a re-render of the massive `Home` component and all of its static child components (`Navbar`, `Hero`, `CTASection`, etc.), heavily impacting scrolling performance.
**Action:** Extract UI elements that depend on fast-changing state (like scroll position) into their own isolated leaf components (e.g., `ScrollProgressBar` and `BackToTopButton`). This confines React state updates and re-renders to only the small components that actually need to visually update, drastically reducing main thread blocking time.
