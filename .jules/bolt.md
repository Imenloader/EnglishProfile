# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2024-06-01 - O(N²) Array Processing in Admin Export
**Learning:** Found an architectural bottleneck during the Excel export in `src/app/admin/page.tsx`. To gather student answers into a matrix for exporting, `.filter()`, `.some()`, and `.find()` were nested inside `.map()` loops over large unpaginated arrays (`filteredLeads` and `answersData`), causing severe O(N²) time complexity that could freeze the browser tab on larger datasets.
**Action:** When performing data aggregations or client-side joins (like mapping questions/answers to leads), always pre-compute Hash Maps and Sets using the shared key (`lead_id`, `question_text`) to enable O(N) conversions with O(1) lookups.
