# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2024-05-17 - O(N^2) Performance Bottleneck in Admin Exports
**Learning:** Generating the student-question matrix and detailed answers in the admin export feature previously used nested loops (`filter`, `find`, `some` inside `map`), resulting in $O(L \times A \times Q)$ and $O(A \times L)$ time complexities. When processing large datasets, these nested array iterations become significant performance bottlenecks that block the main thread and can crash the export.
**Action:** Always pre-compute Hash Maps (`Map`) and Sets (`Set`) for O(1) cross-referencing lookups when joining or aggregating related data arrays in memory, reducing time complexity to O(N + M).
