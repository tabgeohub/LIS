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

## Wave 2 colocation (this session)

Moved 10 HomePage-only hook folders out of `src/hooks` → `Components/HomePage/hooks/`:
`filters`, `handleCancel`, `flightPlan`, `kaartlagen`, `editPoint`, `popUpModal`, `tabs`, `viewPlan`, `bottom`, `layout` (~62 import sites retargeted).

`src/hooks` now holds only: `useContent`, `useLogAction` (hubs) + shared `consts`, `features`, `logging`, `map`, `points`, `shared`, `time`, `zustand`.

Also removed the **2 backward `hooks → HomePage` edges**:
- `hooks/map/useRenderVluchtPlans` → `Components/HomePage/hooks/map/`
- `hooks/features/useRenderGeometries` → `Components/HomePage/hooks/features/`

Verified: no `TS2307` module errors; no remaining `hooks → Components/HomePage` imports.

## Accepts done in Sigrid UI

- Module coupling: hubs `useContent`, `useLogAction`, repos, keycloak, `useCreateDataCore`, layer builders, shared utils → Risk accepted
- Component entanglement: `helpers/http`, `ArcGISHelpers`, `api-hooks`, Timeslider, `helpers/arcgis`, `helpers/geo` → Risk accepted
- Left Raw: `HomePage`, `hooks` entanglement (still adjacency targets)

## Your action (required for score)

1. Commit + deploy the wave-2 moves
2. **Rescan** — target Architecture ≥ **4.0**, adjacency > **2.9**, Data coupling stays ~**3.5**

## Optional leftovers (only if adjacency still weak after rescan)

- More HP-only ArcGIS helpers colocation (`createPoint` / `createPin` stay shared for now — used by ArcGISHelpers internals)
- Remaining raw HTTP behind api-hooks (modest Data access)

## Out of scope

- Dockerfile / Nginx
- Independence `*Core` façades
- Further Data-coupling SQL
- Size LOW grinding
