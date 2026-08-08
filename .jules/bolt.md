# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2026-07-08 - Optimize Related Data Aggregations in AdminDashboard
**Learning:** Generating Excel/CSV exports using multiple `.filter()` or `.find()` operations inside a `.map()` causes an O(N^2) performance bottleneck when mapping related data (e.g., student leads to their answers).
**Action:** Pre-compute Hash Maps (Map) and Sets for O(1) cross-referencing lookups prior to the primary iteration pass to ensure fast O(N) performance on large datasets.
