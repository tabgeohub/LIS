# NEXT-FOCUS-STATUS — Max Architecture Push

## Baseline (architecture exports 20260728)

| Metric | Score |
| --- | --- |
| Architecture | **~3.98** |
| Data coupling | **3.5** (all entities CC=1 — done) |
| Component adjacency | **2.9** (main target) |

## Done (code)

1. **ZustandStates → `hooks/zustand/ui/`** — out of `helpers/`
2. **Nest Timeslider** into `hooks/`, `builders/`, `query/`
3. **Nest helpers roots** into `http/`, `geo/`, `dom/`, `auth/`, `plans/`
4. **Nest hooks roots** into `map/`, `time/`, `tabs/` — hubs `useContent` / `useLogAction` stay at root
5. **Colocate** under HomePage:
   - `hooks/wizard`
   - `zustand/{nabewerking,voorbereiding,tools}`
   - `hooks/hover-click-handlers`
   - `hooks/resultTab`
   - `helpers/tableExports`
6. **Fold** `src/api/fetchApi` → `api-hooks/fetchApi` (removed `src/api`)

## Your action (required for score)

1. **Accept** Independence / coupling / entanglement hubs in Sigrid UI — do **not** rewrite `useContent` / `useLogAction`
2. Deploy + **rescan** — target Architecture ≥ **4.0**, adjacency > **2.9**, Data coupling stays ~**3.5**

## Optional leftovers (only if adjacency still weak after rescan)

- More HP-only ArcGIS helpers colocation (`createPoint` / `createPin` stay shared for now — used by ArcGISHelpers internals)
- Remaining raw HTTP behind api-hooks (modest Data access)

## Out of scope

- Dockerfile / Nginx
- Independence `*Core` façades
- Further Data-coupling SQL
- Size LOW grinding
