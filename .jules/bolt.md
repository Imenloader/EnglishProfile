# Bolt's Journal - Linguaplanet Portal

## 2026-04-30 - Redundant Database Settings Calls
**Learning:** The `db.getSettings()` method is called by multiple top-level components (`Hero`, `CTASection`, `Home`) on the same page, leading to 3-4 identical Supabase requests on initial load. This increases latency and Supabase usage unnecessarily.
**Action:** Implement in-memory caching and request deduplication in `src/data/db.ts` to ensure only one request is made per session/navigation.
## 2024-05-15 - React Performance in AdminDashboard
**Learning:** Consolidating multiple expensive inline array operations (`.filter`, `.reduce`, `.map`) on the `leads` array into a single `O(N)` pass inside a `useMemo` hook effectively prevents redundant calculations on every render, especially when there are input fields (like date filters) that trigger re-renders on keystrokes.
**Action:** Always look for multiple inline array iterations in large components and move them into a single `useMemo` block. Also, be careful not to accidentally commit scratchpad scripts or `node_modules` modifications.
## 2024-05-27 - O(N^2) Performance Bottleneck in Admin Dashboard Export
**Learning:** Generating the Excel export involves joining Leads to LeadAnswers. Previously, it used `Array.some` and `Array.find` inside a loop over the Leads array. Since a single Lead can have ~60 answers, an export of 1000 leads resulted in thousands of nested iterations (O(N*M)), significantly delaying the UI during the export generation and causing potential UI blocking.
**Action:** Always pre-compute Hash Maps (using `Map`) for answers keyed by `lead_id` and use `Set` for IDs when joining arrays in client-side export functions. This creates an O(1) lookup, guaranteeing O(N) linear time for the main operation.
