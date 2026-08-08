# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2024-05-25 - Export Performance in Admin Dashboard
**Learning:** Generating the Excel export inside `src/app/admin/page.tsx` was causing performance bottlenecks due to O(N^2) and O(N^3) nested iterations (`.filter`, `.find`, `.some` inside `.map` loops). This issue scales poorly with database size and freezes the UI when downloading reports.
**Action:** Always pre-compute hash maps (`Record` or `Map`) and `Set` instances for relational data lookups (e.g., matching answers to leads by ID) prior to iterative loops. This converts O(N) array scans into O(1) direct accesses, heavily reducing CPU load.
