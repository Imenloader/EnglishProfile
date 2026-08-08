# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2024-06-17 - O(N^2) Data Export Bottlenecks
**Learning:** Performing multiple `filter`, `find`, and `some` operations inside a top-level `map` loop (e.g., when merging student leads with their answers) causes an O(N^2) bottleneck that heavily impacts Excel export performance in the admin dashboard.
**Action:** Always pre-compute Hash Maps (e.g., grouping answers by lead ID) and Sets before iterating over large data collections to achieve O(1) lookups during the main iteration loop.
