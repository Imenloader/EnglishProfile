# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.

## 2024-05-18 - Array Lookups in Loops
**Learning:** Performing multiple nested Array.filter() and Array.find() loops on a large dataset array inside an outer loop such as Array.map() leads to an O(N^2) complexity that dramatically hurts performance (especially in large excel exports).
**Action:** When cross-referencing lists, first map the target array into a Hash Map (e.g. Map, Record) or a Set to achieve O(1) lookups inside the map loop, turning the complexity to O(N).
