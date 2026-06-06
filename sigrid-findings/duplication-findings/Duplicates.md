# Otg-lis Duplicates — File-Level Status

**Source:** `Duplicates.csv`  
**Companion doc:** `duplication-findings-otg-lis-status.md` (cluster-level view from `Duplication findings.csv`)  
**Date:** 2026-06-05  

---

## How this file relates to `Duplication findings.csv`

| File | Granularity | One row = |
|------|-------------|-----------|
| **Duplication findings.csv** | Cluster | One duplicate pattern (e.g. “72 lines occurring 2 times”) |
| **Duplicates.csv** | **File location** | One file affected by that pattern, with line range and **duplication %** |

Both describe the same **398 duplicate clusters**. This document answers: **which files are hit hardest**, **where in each file**, and **how much of the file is duplicate code**.

---

## Summary

| Metric | Value |
|--------|-------|
| **Rows (file locations)** | **1,038** |
| **Unique duplicate clusters** | **398** (linked by `ID` column) |
| **Avg duplicate blocks per cluster** | ~2.6 files |

Every row shares an `ID` with other rows in the same cluster — use that ID to match back to `Duplication findings.csv`.

---

## By Sigrid component

| Component | Duplicate blocks | Avg duplication % | Notes |
|-----------|------------------|-------------------|-------|
| **HomePage** | 631 | 18.6% | Largest share — UI lists, wizards, map |
| **backend** | 239 | 17.8% | Routes, SQL, validation |
| **hooks** | 99 | 17.2% | Zustand stores, map handlers |
| **DashboardPage** | 25 | 11.3% | AddUser ↔ EditUser |
| **helpers** | 21 | 21.5% | Shared utilities |
| **Types** | 13 | 13.8% | Frontend ↔ backend type mirrors |
| **utils** | 4 | 12.3% | CRUD helpers |
| **Other** | 6 | — | Installations, Devices, public |

---

## 100% identical blocks — delete or merge first

These file regions are **fully duplicated** with another file (easy Sigrid wins):

| Duplication % | Lines | File |
|---------------|-------|------|
| **100%** | L4–82 (47 lines) | `…/EditPointDetails/Actions/Foto/useUploadAttachmentForPoint.ts` |
| **100%** | L4–82 (47 lines) | `…/EditGeometryDetails/Actions/Foto/useUploadAttachmentForPoint.ts` |
| **100%** | L1–11 (11 lines) | `backend/src/routes/keycloak/management/users/types.ts` *(check pair)* |
| **100%** | L5–14 (8 lines) | `…/AandachtspuntenVerwijderen/…/ViewPlans/PlanInformation.tsx` *(vs Voorbereiding)* |

**Action:** Replace with one shared hook/component; delete the copy.

---

## Highest duplication % (blocks ≥ 20 lines)

Files where a large **portion of the file** is copy-paste:

| Dup % | Lines | File |
|-------|-------|------|
| 100% | L4–82 | `…/Foto/useUploadAttachmentForPoint.ts` (both point & geometry) |
| 86% | L7–43 | `hooks/filters/useFilterPlans.ts` ↔ `VluchtenZoeken/hooks/useFilterPlans.ts` |
| 79% | L1–46 | `backend/src/Types/finished_plans.ts` *(unused — safe to delete)* |
| 77% | L15–81 | `CreateReport/…/useGeometryHandlers.ts` ↔ `SingleGeometry.tsx` |
| 75% | L1–46 | `src/Types/finished_plans.ts` |
| 69% | L28–84 | `ViewPlan/…/AddPointToPlan/PointsList.tsx` ↔ `SelectFromSource/PointsList.tsx` |
| 65% | L21–51 | `hooks/hover-click-handlers/usePlanClick.ts` |
| 63% | L26–76 | `Bottom/PlansView/Details/index.tsx` |
| 63% | L8–69 | `hooks/useGetFlightTimesDistance.ts` |

---

## Files with the most duplicate blocks

Files appearing in the **most clusters** (refactor these for broad impact):

### Frontend — HomePage

| Blocks | Max dup % | File |
|--------|-----------|------|
| 22 | 7.9% | `Bottom/ClickedTableFunctions/PointsList.tsx` |
| 18 | 17.2% | `Nabewerking/CreateReport/Steps/Step1/SinglePlan.tsx` |
| 15 | 13.1% | `Common/SearchedResultsTab/Points/index.tsx` |
| 15 | 17.5% | `Common/…/FlightPlans/FlightPlansList/DropDown.tsx` |
| 15 | 31.9% | `Voorbereiding/FlightPlan/helpers/flightPlanStates.ts` *(moved to `hooks/zustand/` — may clear on rescan)* |
| 14 | 17.7% | `Bottom/PointsView/FlightPlansTable/index.tsx` |
| 13 | 12.8% | `Bottom/PointsView/common/hooks/useMapGraphics.ts` |
| 12 | 19.3% | `Nabewerking/VluchtenZoeken/Steps/Step1/Content/SinglePlan.tsx` |
| 12 | 15.9% | `Voorbereiding/ViewPlan/Steps/Step1/SinglePlan.tsx` |
| 11 | 29.8% | `Common/ResultTab/PointsList.tsx` |
| 11 | 17.6% | `Common/ResultTab/ListPointsFunctions/index.tsx` |
| 12 | 18.9% | `Common/SearchedResultsTab/Points/DropDown.tsx` |

### hooks

| Blocks | Max dup % | File |
|--------|-----------|------|
| 13 | 32% | `hooks/zustand/useReuseFlightPlan.ts` |
| 13 | 22.6% | `hooks/zustand/nabewerking/useFinishedPlansState.ts` |
| 12 | 20.3% | `hooks/zustand/nabewerking/useCreateReportState.ts` |
| 12 | 25% | `hooks/zustand/nabewerking/useChangePlanStatusState.ts` |

### Backend

| Blocks | Max dup % | File |
|--------|-----------|------|
| 15 | 21.6% | `routes/flightPlans/getAllFlightPlans.ts` |
| 14 | 18.6% | `routes/points/editPoint.ts` |
| 12 | 27.7% | `routes/finished_plans/getPartialFinishedPlans.ts` |
| 12 | 18.3% | `routes/points/createPoint.ts` |
| 11 | 31.5% | `routes/flightPlans/getFullPreparedFlightPlans.ts` |
| 10 | 17% | `routes/flightPlans/createFlightPlan.ts` |
| 10 | 25.7% | `backend/src/Types/index.ts` |
| 9 | 32.8% | `routes/flightPlans/getPrepreparedFlightPlans.ts` |
| 9 | 30% | `routes/flightPlans/getSearchedFlightPlans.ts` |

---

## Top file pairs (share the most duplicate clusters)

When these two files change, you often need to change both:

| Shared clusters | File A | File B |
|-----------------|--------|--------|
| **10** | `backend/src/Types/index.ts` | `src/Types/index.ts` |
| **10** | `ResultTab/PointsList.tsx` | `ResultTab/PointsListEdit.tsx` |
| **9** | `CreateReport/…/SinglePlan.tsx` | `VluchtenZoeken/…/SinglePlan.tsx` |
| **9** | `DashboardPage/AddUser/index.tsx` | `DashboardPage/EditUser/index.tsx` |
| **9** | `useChangePlanStatusState.ts` | `useCreateReportState.ts` |
| **7** | `getFullPreparedFlightPlans.ts` | `getUnPreparedPlans.ts` |
| **6** | `getPrepreparedFlightPlans.ts` | `getSearchedFlightPlans.ts` |
| **6** | `FlightPlansTable/index.tsx` | `FlightPlansList/List.tsx` |
| **6** | `useMapGraphics.ts` | `FlightPlansTable/index.tsx` |
| **6** | `EditGeometryDetails/…/Foto/index.tsx` | `EditPointDetails/…/Foto/index.tsx` |
| **6** | `PointsList.tsx` | `SearchedResultsTab/Points/index.tsx` |
| **6** | `ListPointsFunctions/index.tsx` | `Points/DropDown.tsx` |

**Action:** Extract shared module for each pair (component, hook, query helper, or types).

---

## Same-file duplication (38 clusters)

Code duplicated **within one file** — usually `clear()` mirroring initial state, or repeated blocks in one component.

| Redundant lines | Pattern | File |
|-----------------|---------|------|
| 40 | 40 lines × 2 | `hooks/zustand/useReuseFlightPlan.ts` |
| 36 | 36 lines × 2 | `flightPlanStates.ts` *(relocated in Phase 2)* |
| 34 | 34 lines × 2 | `SearchedResultsTab/Functions/PointsBuffer.tsx` |
| 20 | 10 lines × 3 | `backend/…/flightPlans/createFlightPlan.ts` |
| 17 | 17 lines × 2 | `FlightPlansTable/index.tsx` |
| 17 | 17 lines × 2 | `hooks/zustand/useEnrichedPointState.ts` |
| 15 | 15 lines × 2 | `GeometriesTable/index.tsx` |
| 15 | 15 lines × 2 | `EditGeometryDetails/…/Foto/CreateImageBtn.tsx` |

**Action:** Use `const initialState = { … }; clear: () => set(initialState)` in Zustand stores; extract repeated JSX into subcomponents.

---

## Grouped by feature area (file hotspots)

### Nabewerking — Vluchten zoeken & foto

| File | Issue |
|------|-------|
| `…/Foto/index.tsx` (point & geometry) | 6+ shared clusters, up to 72-line blocks |
| `…/Foto/useUploadAttachmentForPoint.ts` | **100% duplicate** — merge into one hook |
| `Steps/Step1/Content/SinglePlan.tsx` | 12 blocks — overlaps CreateReport SinglePlan |
| `hooks/useFilterPlans.ts` | 86% overlap with `hooks/filters/useFilterPlans.ts` |

### Search, result tab & bottom panel

| File | Issue |
|------|-------|
| `Points/index.tsx` | 15 duplicate blocks |
| `Points/DropDown.tsx` | 12 blocks |
| `PointsList.tsx` / `PointsListEdit.tsx` | 10 shared clusters |
| `ClickedTableFunctions/PointsList.tsx` | 22 blocks (highest in app) |
| `FlightPlansTable/index.tsx` | 14 blocks + internal duplication |
| `useMapGraphics.ts` | 13 blocks — plan/point map graphics |

### Voorbereiding — flight plan & view plan

| File | Issue |
|------|-------|
| `flightPlanStates.ts` | 15 blocks *(store moved — rescan)* |
| `ViewPlan/Steps/Step1/SinglePlan.tsx` | 12 blocks |
| `AddPointToPlan/PointsList.tsx` | 69% overlap with SelectFromSource list |
| `DrawingTool/*` | Multiple steps share filter/reset blocks |

### Backend — routes

| Pattern | Files |
|---------|-------|
| Search SQL fragments | `getAllFlightPlans`, `getSearchedFlightPlans`, `getSearchedPoints`, `getPrepreparedFlightPlans` |
| CRUD validation | `createPoint.ts` (3 blocks), `editPoint.ts`, `createFlightPlan.ts` |
| Finished plans queries | `getPartialFinishedPlans`, `getSingleFinishedFlightPlan`, `getFinishedPlansTimeslider` |
| Create/update headers | `createFlightPlan.ts` ↔ `updateVluchtPlan.ts` |

### Types — cross-stack mirrors

| File pair | Clusters | Fix |
|-----------|----------|-----|
| `backend/src/Types/finished_plans.ts` ↔ `src/Types/finished_plans.ts` | 1 cluster, ~79% of file | **Delete backend copy** (unused) |
| `backend/src/Types/index.ts` ↔ `src/Types/index.ts` | **10 clusters** | Shared `shared/types/` or accept drift risk |

---

## Recommended fix order (file-centric)

| Priority | Target files | Action | Clusters affected |
|----------|--------------|--------|-------------------|
| **1** | Both `useUploadAttachmentForPoint.ts` | One hook | 1 cluster, 100% dup |
| **2** | Both `Foto/index.tsx` | One component | 6+ clusters |
| **3** | `backend/src/Types/finished_plans.ts` | Delete | 1 cluster |
| **4** | `CreateReport/SinglePlan` + `VluchtenZoeken/SinglePlan` | Shared `FinishedPlanCard` | 9 clusters |
| **5** | `PointsList` + `PointsListEdit` + `Points/index` | Shared point list logic | 10+ clusters |
| **6** | `getAllFlightPlans` + search route family | SQL helper | 15+ blocks across backend |
| **7** | `useReuseFlightPlan` + Nabewerking zustand stores | DRY initial/clear state | 13+ blocks each |
| **8** | `backend/Types/index` + `src/Types/index` | Shared types folder | 10 clusters |
| **9** | `ClickedTableFunctions/PointsList` | Extract map/table helpers | 22 blocks |
| **10** | `Dashboard AddUser` + `EditUser` | Shared form | 9 clusters |

---

## Column reference (`Duplicates.csv`)

| Column | Meaning |
|--------|---------|
| **ID** | Cluster UUID — matches rows in the same duplicate group |
| **Path** | File path in repo |
| **Component** | Sigrid component (HomePage, backend, hooks, …) |
| **Lines of code** | Size of the duplicated block |
| **Duplication percentage** | What % of **this file** is that duplicate block |
| **Start line / End line** | Exact location to inspect in the IDE |

---

## Already addressed (may still appear until Sigrid rescan)

| Change | Files in CSV | Expected after rescan |
|--------|--------------|------------------------|
| Deleted `backend/src/Types/finished_plans.ts` | 79% dup row | Removed |
| Moved `flightPlanStates.ts` → `hooks/zustand/voorbereiding/` | 15 blocks on old path | Updated paths |
| Cycle #1 / #2 refactors | Unrelated to duplication CSV | No change |

---

## Files in this folder

| File | Use |
|------|-----|
| `Duplication findings.csv` | Cluster summary (398 rows) |
| `Duplicates.csv` | File locations (1,038 rows) — **this doc** |
| `duplication-findings-otg-lis-status.md` | Thematic / cluster grouping |
| `duplicates-otg-lis-status.md` | File-level grouping — **this doc** |
