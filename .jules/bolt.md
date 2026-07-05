# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2024-05-16 - O(N²) Performance Bottleneck in Admin Dashboard Excel Export
**Learning:** During the Excel export process in `src/app/admin/page.tsx`, nested array operations (such as `.filter`, `.find`, and `.some` nested inside `.map` and `.forEach`) on large datasets (leads and answers) caused O(N²) execution times, heavily blocking the main thread and slowing down the data export.
**Action:** When performing data aggregations or generating exports involving related data, always pre-compute lookups using Hash Maps (e.g., `Map<string, Map<string, any>>`) and `Set`s for cross-referencing. This achieves O(1) lookups and significantly reduces processing time for large datasets.
