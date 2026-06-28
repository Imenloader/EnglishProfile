# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.

## 2026-05-18 - Admin Excel Export N^2 Bottleneck
**Learning:** Generating the Excel export by running nested `Array.filter` and `Array.find` within the top-level `Array.map` over all leads creates an O(N^2) time complexity. As the database grows, this blocks the main thread and severely degrades export performance.
**Action:** When cross-referencing relational data like leads and answers for exports, always pre-compute O(1) Hash Maps (`new Map()`) or Sets (`new Set()`) outside of the mapping loop.
