# Otg-lis Duplication Findings — Status

**Source:** `Duplication findings.csv` + `Duplicates.csv`  
**Sigrid pillar:** Maintainability (code duplication)  
**Date:** 2026-06-05  

---

## Summary


| Metric                      | Value                                      |
| --------------------------- | ------------------------------------------ |
| **Duplicate clusters**      | **398** in export · **~272** remaining     |
| **Severity**                | All **HIGH**                               |
| **Status**                  | **~126 FIXED** · **~272 RAW**              |
| **Total redundant lines**   | **~6,361** · **~3,950** remaining          |
| **File locations affected** | **1,038** in export (pre-rescan)           |


Duplication means the **same block of code appears in multiple places**. Sigrid counts how many lines are redundant and how often they repeat. Fixing duplication improves maintainability — one change updates one shared function instead of many copies.

---

## Fixed

### Foto / attachments — point vs geometry *(2026-06-05)*

**15 clusters · ~303 redundant lines · Nabewerking**

Merged duplicate point/geometry foto screens into `…/Waarnemingen/common/Foto/`:

- `FotoPanel.tsx`, `CreateImageBtn.tsx`, `useUploadAttachmentForPoint.ts`
- Map hooks: `useFotoMapClickHandler`, `useImageMarkersOnMap`, `navigateToLocation`
- Plan sync: `syncAttachmentsInPlan.ts`
- Thin wrappers remain in `EditPointDetails/Actions/Foto/` and `EditGeometryDetails/Actions/Foto/`

**Test:** see `Duplication-test-checklist.md` → *Foto / attachments*.

### Flight plan map & list UI *(2026-06-05)*

**40 clusters · ~904 redundant lines · Search, bottom panel, hooks, SinglePlan**

Shared helpers and hooks under `src/helpers/ArcGISHelpers/` and `src/hooks/hover-click-handlers/`:

- `createPlanBoundingBoxGraphic.ts`, `computeFlightPlanCentroid.ts`, `finishedPlanMapGraphics.ts`
- `usePlanClick.ts`, `usePlanHover.ts`, `usePlanStarGraphic.ts`, `useFinishedPlanMapHighlight.ts`
- Wired: `FlightPlansList/List`, `DropDown`, `FlightPlansTable`, `useMapGraphics` (flightPlans tab)
- Centroid menus: `ClickedPlan`, `PlansList`, `FlightPlanDetails/DropDown`
- SinglePlan rows: `ViewPlan`, `VluchtenZoeken`, `CreateReport` (+ `ReuseFlightPlan` already used hooks)

**Test:** see `Duplication-test-checklist.md` → *Flight plan map & list UI*.

### Point list & star/highlight on map *(2026-06-05)*

**44 clusters · ~743 redundant lines · Search tab, result tab, bottom table**

Shared helpers and hook:

- `createPointMapGraphics.ts` — star/hover/yellow-marker graphics, `goTo`, `syncPointsTableMapGraphics`, `starAllPointsOnMap`
- `createSymbols.ts` — `SEARCH_RESULT_POINT_OUTLINE_SYMBOL`, `POINT_HOVER_PIN_SYMBOL` (uses existing `STARRED_POINT_SYMBOL`, `YELLOW_MARKER_SYMBOL`)
- `usePointListMapActions.ts` — hover, goTo, toggle star, star-all
- Wired: `SearchedResultsTab/Points/index`, `Points/DropDown`, `ResultTab/PointsList`, `PointsListEdit`, `ListPointsFunctions`, `PointsTable`, `useMapGraphics` (points tab)

**Test:** see `Duplication-test-checklist.md` → *Point list & star/highlight on map*.

### Drawing tool — map cleanup & lifecycle *(2026-06-05)* · **Tested ✓**

**6 clusters · ~121 redundant lines · Voorbereiding**

Shared helpers under `DrawingTool/helpers/`:

- `drawingToolMapCleanup.ts`, `resetSketchSession.ts`, `useOmschrijvingExists.ts`
- `useDrawingToolLifecycle.ts` — `useDrawingToolRootLifecycle`, `useDrawingToolStep1Lifecycle`, `useDrawingToolStep2Lifecycle`
- Wired: `DrawingTool/index`, `Step1`, `Step2`, `Step2/Buttons`, `Step1/Options`
- Form fields: `Common/AandachtspuntDetailsFields.tsx` (+ `GeometryOmschrijvingField` / `EnrichedAddPoint/.../Omschrijving`)

**Test:** `Duplication-test-checklist.md` → *Drawing tool* — all items passed.

### Geometry rendering & handlers *(2026-06-05)* · **Tested ✓**

**12 clusters · ~186 redundant lines · Nabewerking, Voorbereiding, bottom table**

- **Phase A — hover:** deleted `CreateReport/…/useGeometryHandlers.ts`; shared `useGeometryHover` in Create report Step 2 + Vluchten zoeken `SingleGeometry`
- **Phase B — graphic factory:** symbol presets + `createGeometryMapGraphics.ts`; wired `GeometriesTable`, `useMapGraphics` (geometries tab), `processGeometry`
- **Phase C — table hook:** `useGeometryListMapActions`; starred graphics restore on tab switch
- **Phase D — click:** `useGeometryClick` (finished single + DB multi-select); wired `SingleGeometry`, `GeometriesList`; `useDrawYellowGeometries` shares `createSelectionGeometryGraphic`

**Test:** `Duplication-test-checklist.md` → *Geometry rendering & handlers* — all items passed.

### Map legend / layers *(2026-06-05)*

**9 clusters · ~146 redundant lines · KaartLegend**

Shared `LegendSection.tsx` + `useLegendLayers.ts` + `layerTypes.ts`; layer configs stay in section files / `nnederlandLayers.tsx`. Wired: Block1 `Section1–3`, Overig `Section1–4`, `NNederland`.

**Test:** `Duplication-test-checklist.md` → *Map legend / layers*.

---

## By application area


| Area                                 | Clusters | Redundant lines | Notes                                        |
| ------------------------------------ | -------- | --------------- | -------------------------------------------- |
| **Backend** (`backend/src/routes/…`) | 99       | ~1,626          | SQL fragments, validation, CRUD handlers     |
| **HomePage — Search & tables**       | 45       | ~750            | Points/plans/geometries tables *(map graphics fixed)* |
| **HomePage — Voorbereiding**         | 73       | ~990            | Flight plan, view plan *(drawing + geometry click fixed)* |
| **HomePage — Nabewerking**           | 35       | ~620            | Vluchten zoeken, create report *(foto + geometry fixed)* |
| **hooks**                            | 47       | ~850            | Zustand stores, map handlers *(plan + point + geometry hooks fixed)* |
| **HomePage — Other**                 | 22       | ~281            | Layout, misc *(KaartLegend fixed)*          |
| **helpers**                          | 12       | ~149            | Shared utilities                             |
| **Other pages**                      | 10       | ~137            | Dashboard, installations                     |
| **HomePage — Tools**                 | 5        | ~68             | Aandachtspunten verwijderen                  |


---

## Grouped by theme (recommended reading order)

Clusters are grouped by **what is duplicated**, not by Sigrid row order.  
**Redundant lines** = total copy-paste cost for that cluster.

---

### 1. Shared types — `finished_plans`

**3 clusters · ~101 redundant lines · Backend + frontend**


| Block size   | Occurrences | Key files                                                             |
| ------------ | ----------- | --------------------------------------------------------------------- |
| **43 lines** | 2×          | `backend/src/Types/finished_plans.ts` ↔ `src/Types/finished_plans.ts` |


**Suggested fix:** Single source of truth in `src/Types/`; backend imports from there (or shared package).

---

### 2. Backend — flight plan / point SQL queries

**29 clusters · ~567 redundant lines**

Same SELECT / JOIN / filter fragments across route handlers.


| Block size   | Occurrences       | Key files                                                                                                                       |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **8 lines**  | **9×** in 9 files | `getAllFlightPlans`, `getSearchedFlightPlans`, `getSearchedPoints`, `getPrepreparedFlightPlans`, `getTemplateFlightPlans`, etc. |
| **17 lines** | 4×                | `getPrepreparedFlightPlans` ↔ `getSearchedFlightPlans` ↔ `getSearchedPoints` ↔ `getPrePreparedPlanPoints`                       |
| 15–16 lines  | 3×                | Shared WHERE / regio filter blocks                                                                                              |


**Suggested fix:** `buildFlightPlanQuery()` / `buildPointSearchQuery()` helpers in `backend/src/helpers/`.

---

### 3. Backend — route validation & CRUD

**45 clusters · ~768 redundant lines**

Repeated request validation and create/update boilerplate.


| Block size   | Occurrences         | Key files                                                                                         |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------- |
| **12 lines** | **7×** in 5 files   | `createFinishedPlan`, `createGeometry`, `createPoint` (×3), `editPoint`, frontend edit step       |
| **6 lines**  | **10×** in 10 files | `createEmail`, `createFlightPlan`, `createPoint`, `editPoint`, `updateVluchtPlan`, status updates |
| **6 lines**  | **10×** in 6 files  | Missing-field checks across routes + frontend buttons                                             |
| 7 lines      | 7–8×                | `editPointStatus`, `updateFlightPlanStatus`, email delete/update                                  |


**Suggested fix:** `validateRequiredFields(req, fields)` middleware or shared validator; standard `handleCreate` pattern.

---

### 4. Zustand store — initial state vs `clear()`

**25 clusters · ~461 redundant lines · hooks**

Store `clear()` functions copy the entire initial state block — duplicated inside the same file or across stores.


| Block size   | Occurrences    | Key files                                                                                          |
| ------------ | -------------- | -------------------------------------------------------------------------------------------------- |
| **40 lines** | 2× (same file) | `useReuseFlightPlan.ts`                                                                            |
| **36 lines** | 2× (same file) | `flightPlanStates.ts` *(moved to `hooks/zustand/voorbereiding/` in Phase 2 — may clear on rescan)* |
| 18–21 lines  | 2–3×           | `useFinishedPlansState`, `useReuseFlightPlan`, `templateFlightStates`                              |
| 6–9 lines    | 5×             | Shared `clear()` field-reset pattern across Nabewerking stores                                     |


**Suggested fix:** Define `initialState` once per store; `clear: () => set(initialState)`.

---

### 5. Edit point form steps

**~3 clusters · ~17 redundant lines · Tools vs Voorbereiding**

Duplicate Step2 sub-forms between “Aandachtspunten verwijderen” and “Selected point edit”.  
*(DrawingTool ↔ EnrichedAddPoint form fields fixed via `AandachtspuntDetailsFields`.)*


| Block size | Key files                                                                    |
| ---------- | ---------------------------------------------------------------------------- |
| 17 lines   | `Step2Sub1.tsx` in Tools ↔ Voorbereiding                                     |
| 8 lines    | `AddToPlan/Step1`, `ViewPlans/PlansList`, etc. (Tools ↔ Voorbereiding pairs) |


**Suggested fix:** Shared form step components under `Components/Common/EditPoint/` (extend `AandachtspuntDetailsFields` where applicable).

---

### 6. View plan — add points

**14 clusters · ~194 redundant lines · Voorbereiding**


| Block size  | Occurrences | Key files                                                                     |
| ----------- | ----------- | ----------------------------------------------------------------------------- |
| 33 lines    | 2×          | `AddPointToPlan/PointsList` ↔ `AddPointsFromPlan/SelectFromSource/PointsList` |
| 16 lines    | 3×          | Coordinate watcher / update button (ViewPlan ↔ EnrichedAddPoint)              |
| 13–14 lines | 2–3×        | Add-point wizard buttons and layout                                           |


**Suggested fix:** Shared `PointsSelectionList` for view-plan flows.

---

### 7. Backend — finished plans queries

**9 clusters · ~127 redundant lines**


| Block size | Occurrences | Key files                                                |
| ---------- | ----------- | -------------------------------------------------------- |
| 23 lines   | 2×          | `getFinishedPlansTimeslider` ↔ `getPartialFinishedPlans` |
| 17 lines   | 2×          | `getFinishedFlightPlans` ↔ `getSingleFinishedFlightPlan` |
| 12 lines   | 3×          | Shared JSON aggregation for finished plans               |


**Suggested fix:** Shared SQL builder for finished-plan fetches.

---

### 8. Layout components

**3 clusters · ~38 redundant lines**


| Block size   | Key files                                                    |
| ------------ | ------------------------------------------------------------ |
| **17 lines** | `Body/Left/Common/Layout/index.tsx` ↔ `Body/Right/index.tsx` |


**Suggested fix:** Extract shared layout wrapper.

---

### 9. Wizard / step buttons

**22 clusters · ~352 redundant lines**

Cancel / next / log-action / clear-graphics blocks repeated across wizard Buttons.tsx files.


| Block size  | Occurrences       | Key files                                                                                            |
| ----------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| **9 lines** | **7×** in 6 files | `EditFlight/Buttons`, `ReuseFlightPlan`, `DuplicateFlightPlan`, `FlightPlan/Step3`, `ViewPlan/Step2` |
| 10 lines    | 4×                | `DuplicateFlightPlan`, `ReuseFlightPlan`, `FlightPlan/Step3`, `TemplateFlights`                      |


**Suggested fix:** `useWizardButtons({ onNext, onCancel, logStep })` hook.

---

### 10. Miscellaneous

**122 clusters · ~1,350 redundant lines**

Smaller or one-off duplicates across Dashboard, emails, filters, import flows, etc. Address opportunistically when touching those files — not worth a dedicated sprint.

---

## Cross-stack duplication (backend ↔ frontend)

**21 clusters** span both backend and frontend (validation shapes, types, similar field checks). Highest priority:


| Item                    | Files                                             |
| ----------------------- | ------------------------------------------------- |
| `finished_plans` types  | `backend/src/Types/` ↔ `src/Types/`               |
| Point create validation | `createPoint.ts` ↔ `EditPointDetails/Steps/Step2` |
| Missing-field checks    | Multiple routes ↔ frontend form buttons           |


---

## Recommended fix priority


| Phase | Theme                                             | Est. redundant lines removed | Effort |
| ----- | ------------------------------------------------- | ---------------------------- | ------ |
| **A** | Shared `finished_plans` types (#1)                | ~100                         | 1 h    |
| **B** | Backend queries + validation (#2, #3)             | ~600+                        | 4–6 h  |
| ~~**C**~~ | ~~Point list map graphics~~ *(done 2026-06-05)* | ~~ ~743 ~~                   | —      |
| ~~**D**~~ | ~~Geometry rendering & handlers~~ *(done 2026-06-05)* | ~~ ~186 ~~              | —      |
| ~~**E**~~ | ~~Map legend / layers~~ *(done 2026-06-05)*     | ~~ ~146 ~~                   | —      |
| **F** | Zustand clear/initial state (#4)                  | ~200+                        | 2 h    |
| **G** | Wizard buttons, view plan, layout (#6, #8, #9)  | ~350+                        | 4–6 h  |


Phases **A + B** remove ~700+ redundant lines with the highest clarity gain (point + plan map graphics already done).

---

## What not to chase

- **Miscellaneous** small blocks (6–8 lines) scattered across unrelated features  
- Duplication inside large one-off wizards unless already editing that area  
- Targeting **0 duplication** — unrealistic for an app this size; aim to clear HIGH clusters in tiers 1–2

---

## Relation to other Sigrid work


| Work done                                             | Effect on duplication CSV                      |
| ----------------------------------------------------- | ---------------------------------------------- |
| **Foto / attachments refactor** (2026-06-05)        | 15 clusters (~303 lines) — shared `common/Foto/` |
| **Flight plan map & list UI** (2026-06-05)          | 40 clusters (~904 lines) — shared ArcGIS helpers + hooks |
| **Point list & star/highlight on map** (2026-06-05) | 44 clusters (~743 lines) — `createPointMapGraphics` + `usePointListMapActions` |
| **Drawing tool map cleanup** (2026-06-05)           | 6 clusters (~121 lines) — `drawingToolMapCleanup` + lifecycle hooks |
| **Geometry rendering & handlers** (2026-06-05)      | 12 clusters (~186 lines) — Phases A–D; `useGeometryHover`, `useGeometryClick`, `useGeometryListMapActions` |
| **Map legend / layers** (2026-06-05)                | 9 clusters (~146 lines) — `LegendSection` + `useLegendLayers` |
| Phase 2: moved `flightPlanStates` to `hooks/zustand/` | Old paths in CSV may still show until rescan   |
| Entanglement fixes                                    | Unrelated to duplication (cycles ≠ copy-paste) |
| Template flight geometry fix                          | Functional fix; no duplication impact          |


**Next step:** Re-export CSV after duplication refactors to mark clusters **FIXED** in Sigrid.

---

## Quick reference — top 10 clusters by redundant lines


| Rank | Redundant lines | Description              | Main locations                 |
| ---- | --------------- | ------------------------ | ------------------------------ |
| 1    | 72              | 12 lines × 7             | Backend + frontend validation  |
| 2    | 64              | 8 lines × 9              | Backend SQL SELECT fragments   |
| 3    | 54              | 9 lines × 7              | Wizard button blocks           |
| 4    | 54              | 6 lines × 10             | Backend CRUD validation        |
| 5    | 51              | 17 lines × 4             | Backend search query blocks    |
| 6    | 47              | 40 lines × 2 (same file) | `useReuseFlightPlan` clear()   |
| 7    | 43              | 43 lines × 2             | `finished_plans` types mirror  |
| 8    | 42              | 14 lines × 3             | Backend SQL SELECT fragments   |
| 9    | 40              | 10 lines × 4             | Drawing tool reset logic *(fixed)* |
| 10   | 44              | 44 lines × 2             | `SingleGeometry` ↔ geometry handlers *(fixed)* |


---

## Files in this folder


| File                                     | Contents                                           |
| ---------------------------------------- | -------------------------------------------------- |
| `Duplication findings.csv`               | 398 duplicate clusters — one row per cluster       |
| `Duplicates.csv`                         | 1,038 rows — one row per file location per cluster |
| `Duplication-findings.md`                | Cluster status & fix priority                      |
| `Duplication-test-checklist.md`          | Regression tests to run after each duplication fix |


