# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2024-05-16 - Client-Side Excel Export Freeze
**Learning:** The `handleExportExcel` feature in the Admin dashboard generates massive spreadsheets on the client side. Doing nested array operations (`Array.filter` inside `Array.map` and `Array.some` inside `Array.filter`) over thousands of rows blocks the main thread, freezing the UI.
**Action:** When handling data aggregation for client-side file generation, strictly enforce `O(1)` Hash Map and Set lookups to cross-reference data arrays. Never use nested iterations for data merging on the main thread.
