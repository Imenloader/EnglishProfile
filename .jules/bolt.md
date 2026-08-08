# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2026-07-01 - O(N^2) Array Iterations in Excel Export
**Learning:** During Excel exports in `src/app/admin/page.tsx`, iterating over large datasets with `Array.filter` and `Array.find` inside `Array.map` (e.g. for generating matrices or detailed answers) creates an O(N^2) complexity bottleneck, causing the main thread to freeze for large datasets.
**Action:** For data aggregations and exports, always pre-compute Hash Maps (for key-based lookups) and Sets (for existence checks) to achieve O(1) lookups and bring the overall complexity down to O(N).
