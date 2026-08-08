# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2026-05-30 - Optimization of CSV Export Data Aggregation
**Learning:** In the admin dashboard CSV export functionality, aggregating data by iterating over large arrays using nested `.filter()` and `.find()` causes O(N^2) bottlenecks when matching leads to their specific answers. Generating data grids with thousands of rows and columns can block the main thread and crash the browser tab.
**Action:** Pre-compute Hash Maps (to associate leads with their answers) and Sets (for filtered IDs) before building the grid rows, which transforms nested O(N^2) loop complexities into linear O(N) operations with O(1) lookups.
