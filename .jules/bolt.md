# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2026-05-18 - Excel Export Performance in AdminDashboard
**Learning:** Generating the student-question matrix and detailed answers dynamically mapped nested array `.filter` and `.find`/`.some` operations across potentially large datasets inside a `.map` loop, creating an O(N^2) bottleneck. In JS edge environments, this can severely block thread execution and slow down or time out large data exports.
**Action:** Used Hash Maps (`Map`) to pre-group data and a `Set` to store valid IDs for cross-referencing. This transforms nested `Array.filter` calls inside loops into O(1) lookups, providing linear O(N) performance for computationally heavy matrix logic and CSV generation.
