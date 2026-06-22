# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2024-05-17 - O(N^2) Nested Array Iterations in Data Export
**Learning:** For data aggregations and Excel/CSV exports involving related data (e.g., mapping leads to answers), $O(N^2)$ nested iterations like `Array.filter` or `Array.find` inside `Array.map` can cause significant performance bottlenecks when processing large volumes of data synchronously on the main thread or on an edge runtime.
**Action:** Always pre-compute Hash Maps (using `Map` or objects) and Hash Sets (`Set`) for cross-referencing related data to achieve $O(1)$ lookups before iterating over the main dataset to map the export rows.
