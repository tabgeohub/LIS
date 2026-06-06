# Otg-lis Duplication Findings — Status

**Source:** `Duplication findings.csv` + `Duplicates.csv`  
**Sigrid pillar:** Maintainability (code duplication)  
**Date:** 2026-06-05  

---

## Summary


| Metric                      | Value                                      |
| --------------------------- | ------------------------------------------ |
| **Duplicate clusters**      | **398** in export · **~383** remaining     |
| **Severity**                | All **HIGH**                               |
| **Status**                  | **15 FIXED** (Foto) · **383 RAW**          |
| **Total redundant lines**   | **~6,361** · **~6,058** remaining          |
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

---

## By application area


| Area                                 | Clusters | Redundant lines | Notes                                        |
| ------------------------------------ | -------- | --------------- | -------------------------------------------- |
| **Backend** (`backend/src/routes/…`) | 99       | ~1,626          | SQL fragments, validation, CRUD handlers     |
| **HomePage — Search & tables**       | 61       | ~1,087          | Points/plans lists, bottom panel, search tab |
| **HomePage — Voorbereiding**         | 78       | ~1,070          | Flight plan, view plan, drawing tool         |
| **HomePage — Nabewerking**           | 40       | ~679            | Vluchten zoeken, create report *(foto fixed)* |
| **hooks**                            | 52       | ~935            | Zustand stores, map handlers                 |
| **HomePage — Other**                 | 22       | ~281            | Layout, misc                                 |
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

### 2. Flight plan map & list UI

**40 clusters · ~904 redundant lines · Search, bottom panel, hooks**

Repeated logic for drawing flight plans on the map and rendering plan rows.


| Block size  | Occurrences         | Key files                                                                                                               |
| ----------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **8 lines** | **14×** in 10 files | `FlightPlansList/DropDown`, `FlightPlansTable`, `SinglePlan.tsx` (×3), `usePlanClick`, `usePlanHover`, `useMapGraphics` |
| **9 lines** | **10×** in 7 files  | Same cluster — plan highlight / go-to on map                                                                            |
| **7 lines** | **12×** in 8 files  | Plan list row click handling                                                                                            |
| 14–21 lines | 3–4×                | `ClickedPlan`, `PlansList`, `FlightPlanDetails/DropDown`                                                                |


**Suggested fix:** Extract `usePlanMapHighlight()` and a shared `PlanListRow` / map graphic helper.

---

### 3. Point list & star/highlight on map

**44 clusters · ~743 redundant lines · Search tab, result tab**

Star toggle, yellow markers, and hover graphics duplicated across point list components.


| Block size  | Occurrences | Key files                                                                                            |
| ----------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| **8 lines** | 7–8×        | `Points/index.tsx`, `PointsList.tsx`, `PointsListEdit.tsx`, `Points/DropDown`, `ListPointsFunctions` |
| 11 lines    | 4×          | Star / highlight graphic creation                                                                    |
| 15–16 lines | 3×          | Point row click + map `goTo`                                                                         |


**Suggested fix:** Shared `usePointListMapGraphics()` or extract star/highlight helpers used by all point list variants.

---

### 4. Backend — flight plan / point SQL queries

**29 clusters · ~567 redundant lines**

Same SELECT / JOIN / filter fragments across route handlers.


| Block size   | Occurrences       | Key files                                                                                                                       |
| ------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **8 lines**  | **9×** in 9 files | `getAllFlightPlans`, `getSearchedFlightPlans`, `getSearchedPoints`, `getPrepreparedFlightPlans`, `getTemplateFlightPlans`, etc. |
| **17 lines** | 4×                | `getPrepreparedFlightPlans` ↔ `getSearchedFlightPlans` ↔ `getSearchedPoints` ↔ `getPrePreparedPlanPoints`                       |
| 15–16 lines  | 3×                | Shared WHERE / regio filter blocks                                                                                              |


**Suggested fix:** `buildFlightPlanQuery()` / `buildPointSearchQuery()` helpers in `backend/src/helpers/`.

---

### 5. Backend — route validation & CRUD

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

### 6. Drawing tool

**6 clusters · ~121 redundant lines · Voorbereiding**


| Block size   | Occurrences       | Key files                                                                   |
| ------------ | ----------------- | --------------------------------------------------------------------------- |
| **10 lines** | **5×** in 4 files | `DrawingTool/index`, `Step1`, `Step2`, `Step2/Buttons` — filter/reset logic |
| 12 lines     | 4×                | Same reset pattern                                                          |
| 19 lines     | 2×                | `DrawingTool/index` ↔ `Step2/index`                                         |


**Suggested fix:** Single `resetDrawingToolState()` used by all steps.

---

### 7. Zustand store — initial state vs `clear()`

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

### 8. Geometry rendering & handlers

**12 clusters · ~186 redundant lines**


| Block size   | Occurrences       | Key files                                                                |
| ------------ | ----------------- | ------------------------------------------------------------------------ |
| **44 lines** | 2×                | `SingleGeometry.tsx` ↔ `CreateReport/…/useGeometryHandlers.ts`           |
| **8 lines**  | **7×** in 5 files | `GeometriesTable`, `processGeometry`, `SingleGeometry`, `useMapGraphics` |
| 10 lines     | 3×                | Geometry table ↔ map graphics sync                                       |


**Suggested fix:** Shared `renderGeometryOnMap()` / merge `SingleGeometry` with handler hook.

---

### 9. Edit point form steps

**4 clusters · ~30 redundant lines · Tools vs Voorbereiding**

Duplicate Step2 sub-forms between “Aandachtspunten verwijderen” and “Selected point edit”.


| Block size | Key files                                                                    |
| ---------- | ---------------------------------------------------------------------------- |
| 17 lines   | `Step2Sub1.tsx` in Tools ↔ Voorbereiding                                     |
| 8 lines    | `AddToPlan/Step1`, `ViewPlans/PlansList`, etc. (Tools ↔ Voorbereiding pairs) |


**Suggested fix:** Shared form step components under `Components/Common/EditPoint/`.

---

### 10. Map legend / layers

**9 clusters · ~146 redundant lines**

KaartLegend section components repeat layer-toggle patterns.


| Block size | Occurrences | Key files                                                   |
| ---------- | ----------- | ----------------------------------------------------------- |
| 7 lines    | **5×**      | `LayersList/Block1/Section1`, `Section2`, `Overig/Section`* |
| 16 lines   | 2×          | `Block1/Section2` ↔ `Overig/Section2`                       |


**Suggested fix:** Generic `LegendSection` component with props for layer config.

---

### 11. View plan — add points

**14 clusters · ~194 redundant lines · Voorbereiding**


| Block size  | Occurrences | Key files                                                                     |
| ----------- | ----------- | ----------------------------------------------------------------------------- |
| 33 lines    | 2×          | `AddPointToPlan/PointsList` ↔ `AddPointsFromPlan/SelectFromSource/PointsList` |
| 16 lines    | 3×          | Coordinate watcher / update button (ViewPlan ↔ EnrichedAddPoint)              |
| 13–14 lines | 2–3×        | Add-point wizard buttons and layout                                           |


**Suggested fix:** Shared `PointsSelectionList` for view-plan flows.

---

### 12. Backend — finished plans queries

**9 clusters · ~127 redundant lines**


| Block size | Occurrences | Key files                                                |
| ---------- | ----------- | -------------------------------------------------------- |
| 23 lines   | 2×          | `getFinishedPlansTimeslider` ↔ `getPartialFinishedPlans` |
| 17 lines   | 2×          | `getFinishedFlightPlans` ↔ `getSingleFinishedFlightPlan` |
| 12 lines   | 3×          | Shared JSON aggregation for finished plans               |


**Suggested fix:** Shared SQL builder for finished-plan fetches.

---

### 13. Layout components

**3 clusters · ~38 redundant lines**


| Block size   | Key files                                                    |
| ------------ | ------------------------------------------------------------ |
| **17 lines** | `Body/Left/Common/Layout/index.tsx` ↔ `Body/Right/index.tsx` |


**Suggested fix:** Extract shared layout wrapper.

---

### 14. Wizard / step buttons

**22 clusters · ~352 redundant lines**

Cancel / next / log-action / clear-graphics blocks repeated across wizard Buttons.tsx files.


| Block size  | Occurrences       | Key files                                                                                            |
| ----------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| **9 lines** | **7×** in 6 files | `EditFlight/Buttons`, `ReuseFlightPlan`, `DuplicateFlightPlan`, `FlightPlan/Step3`, `ViewPlan/Step2` |
| 10 lines    | 4×                | `DuplicateFlightPlan`, `ReuseFlightPlan`, `FlightPlan/Step3`, `TemplateFlights`                      |


**Suggested fix:** `useWizardButtons({ onNext, onCancel, logStep })` hook.

---

### 15. Miscellaneous

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
| **B** | Flight plan map & list UI (#2)                    | ~400+                        | 3–4 h  |
| **C** | Backend queries + validation (#4, #5)             | ~600+                        | 4–6 h  |
| **D** | Point list map graphics (#3)                      | ~400+                        | 3–4 h  |
| **E** | Zustand clear/initial state (#7)                  | ~200+                        | 2 h    |
| **F** | Geometry, drawing tool, legend (#6, #8, #10)      | ~450+                        | 6–8 h  |
| **G** | Wizard buttons, view plan, layout (#11, #13, #14) | ~350+                        | 4–6 h  |


Phases **A + B + C** remove ~1,100 redundant lines with the highest clarity gain.

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
| Phase 2: moved `flightPlanStates` to `hooks/zustand/` | Old paths in CSV may still show until rescan   |
| Entanglement fixes                                    | Unrelated to duplication (cycles ≠ copy-paste) |
| Template flight geometry fix                          | Functional fix; no duplication impact          |


**Next step:** Re-export CSV after duplication refactors to mark clusters **FIXED** in Sigrid.

---

## Quick reference — top 10 clusters by redundant lines


| Rank | Redundant lines | Description              | Main locations                 |
| ---- | --------------- | ------------------------ | ------------------------------ |
| 1    | 104             | 8 lines × 14 occurrences | Plan map highlight — 10 files  |
| 2    | 81              | 9 lines × 10 occurrences | Plan click/hover — 7 files     |
| 3    | 77              | 7 lines × 12 occurrences | Plan list row — 8 files        |
| 4    | 72              | 12 lines × 7             | Backend + frontend validation  |
| 5    | 64              | 8 lines × 9              | Backend SQL SELECT fragments   |
| 6    | 56              | 8 lines × 8              | Point hover graphic            |
| 7    | 54              | 9 lines × 7              | Wizard button blocks           |
| 8    | 54              | 6 lines × 10             | Backend CRUD validation        |
| 9    | 51              | 17 lines × 4             | Backend search query blocks    |
| 10   | 47              | 40 lines × 2 (same file) | `useReuseFlightPlan` clear()   |


---

## Files in this folder


| File                                     | Contents                                           |
| ---------------------------------------- | -------------------------------------------------- |
| `Duplication findings.csv`               | 398 duplicate clusters — one row per cluster       |
| `Duplicates.csv`                         | 1,038 rows — one row per file location per cluster |
| `Duplication-findings.md`                | This document                                      |


