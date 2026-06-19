# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2026-06-19 - Isolated Scroll Event Component
**Learning:** Large React components (like the main `Home` page) that register scroll listeners and update state within themselves will trigger full re-renders on every scroll event, hurting performance. In `src/app/page.tsx`, the `scrollProgress` and `showScrollTop` states were updating on scroll, causing the massive component to render repeatedly.
**Action:** Isolate UI elements dependent on fast-changing state (like scroll progress bars and back-to-top buttons) into their own leaf components (e.g., `ScrollFeatures`). This confines the state updates and re-renders to the small leaf component, preserving the parent component's performance.
