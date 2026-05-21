# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2024-05-18 - Excel Export Performance in AdminDashboard
**Learning:** The previous Excel export logic used nested `.find()` and `.some()` loops against arrays of data (leads, unique questions, student answers) leading to (N^2)$ time complexity. This was severely bottlenecking the export functionality when the dataset became large. Pre-computing a `Set` of lead IDs and a `Map` mapping `lead_id` to a Map of `question_text -> is_correct` converted these lookups into (1)$ operations, significantly improving performance to (N)$.
**Action:** Always map related data sets into lookup maps or sets prior to iterating over them when creating aggregated representations such as CSVs or Excel exports to ensure operations remain (N)$.
