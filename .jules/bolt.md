# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2026-06-20 - Array Iteration Performance in Admin Dashboard Excel Export
**Learning:** In `src/app/admin/page.tsx` the Excel export generated (N^2)$ computations by doing `Array.filter` and `Array.some` nested within `Array.map` iterations over the answers datasets. This slowed down file generation significantly.
**Action:** Always pre-compute a `Map` or `Set` of the corresponding related data array when iterating over large collections of relations (e.g. leads mapped to answers) to achieve (1)$ lookup time.
