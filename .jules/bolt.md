# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2026-06-25 - O(N²) array operations in Excel Export
**Learning:** During the Excel export in the Admin Dashboard, nested array iterations (`Array.map` containing `Array.find` or `Array.filter` containing `Array.some`) were causing O(N²) performance bottlenecks when processing large numbers of leads and answers.
**Action:** Always pre-compute Hash Maps (for key-value lookups like answers per lead and question) and Sets (for existence checks like filtering by ID) to achieve O(1) lookups and avoid nested array iteration performance penalties during data aggregation.
