# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2024-05-15 - O(N^2) Bottlenecks in Data Export Utilities
**Learning:** During Excel exports in `handleExportExcel`, nested `Array.filter` and `Array.find` within an `Array.map` (e.g., matching answers to students) created severe O(N^2) time complexity. For a large dataset of leads and thousands of answers, this freezes the main thread.
**Action:** Always pre-compute Hash Maps (e.g., `Map<leadId, Map<question, answer>>`) and Sets (e.g., `Set<leadId>`) for cross-referencing relational data in export functions or data aggregations, ensuring O(1) lookups instead of O(N).
