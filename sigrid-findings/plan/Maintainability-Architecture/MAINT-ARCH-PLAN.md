# Maintainability & Architecture Plan

**Source:** `exported-findings-6` · **Generated:** 2026-07-04

**1081 RAW** maintainability + architecture findings in `exported-findings-6`.
**Delta vs `exported-findings-5`:** +29 maint+arch RAW (1052 → 1081). Dashboard: Maintainability **2.9 → 3.1** (+0.2) despite net RAW increase — see [ANALYSIS-export-5-to-6.md](./ANALYSIS-export-5-to-6.md).


## Progress (STEPS 01–08 implemented)

| Step | Status | E5→E6 outcome |
|------|--------|---------------|
| STEP-01 | ✅ Done | WizardButtonBar + A1 interfacing; interfacing −8 |
| STEP-02 | ✅ Done | SelectFromSource / ImportVluchtPlan / GeometriesList / DrawingTool |
| STEP-03 | ✅ Done | Backend routes/services A2 extractions |
| STEP-04 | ✅ Done | api-hooks factory; component independence −19 |
| STEP-05 | ✅ Done | EditPointCoordinates, generatePdfReport, Timeslider splits |
| STEP-06 | ✅ Done | Map hooks + popUpModal + regio hook options |
| STEP-07 | ✅ Done | Tools, Bottom lists, misc Common UI |
| **STEP-08** | **✅ Done (await deploy + E7)** | ArcGIS, admin, dup tail, MapComp |

**Key metric:** HIGH severity maint+arch **128 → 79** (−49). Extraction trade-off: +51 unit size from new helper files — avoid unnecessary splits.

> **Next:** Deploy, re-export Sigrid as `exported-findings-7`, run `compare-6-vs-7.py`, regenerate plan.

> **Read first:** [STRATEGY.md](./STRATEGY.md) · [ANALYSIS-export-5-to-6.md](./ANALYSIS-export-5-to-6.md) · [ANALYSIS-export-4-to-5.md](./ANALYSIS-export-4-to-5.md)

## Finding counts (code only)

| Category | RAW |
|----------|----:|
| Unit size | 619 |
| Unit complexity | 242 |
| Unit interfacing | 92 |
| Module coupling | 25 |
| Component independence | 94 |
| Component entanglement | 9 |
| **Total in this plan** | **1081** |

## Execution steps (≥100 findings each)

**Rule:** Do not start the next step until the current one is merged, deployed, and a new Sigrid export confirms the expected drop. Small 20–30 finding batches are too slow to move stars.

> **Note:** Step RAW counts are **scopes at `exported-findings-6`**. STEPS 01–08 are implemented; deploy and re-export before further work.

| Step | Name | Open RAW (E6) | Size | Primary tactic |
|------|------|--------------:|:----:|----------------|
| STEP-01 | DUP-01 wizard buttons + A1 interfacing sweep | **254** | ✓ | Part A: extract shared WizardButtonBar / step action patterns (DUP-01). Part B: every remaining Unit interfacing finding → single input object or class fields (≤2 params). Backend mostly done in E4→E5. |
| STEP-02 | Voorbereiding complexity (MAINT-03) | **188** | ✓ | A2 on highest McCabe units: SelectFromSource (54), ImportVluchtPlan (39), GeometriesList, DrawingTool. Use lookup tables / early returns |
| STEP-03 | Backend complexity + size (MAINT-01) | **245** | ✓ | A2 on backend routes/services (getPoints, postProxyHandler, devices-updates). A3 only where extractions stay ≤2 params and ≤5 McCabe. No file moves. |
| STEP-04 | Architecture — api-hooks factory (ARCH-03) | **94** | ⚠ | B2: consolidate const/lookup api-hooks (~21) into useLookupQuery(resource) factory |
| STEP-05 | Nabewerking + Timeslider (MAINT-02 + MAINT-07) | **156** | ✓ | A2 on EditPointCoordinates (46), generatePdfReport (26), useTimesliderImagePageData (46), TimesliderItemDetailPage. |
| STEP-06 | Map hooks + api-hooks slice (MAINT-08c + 08d + 08e) | **153** | ✓ | Reduce complexity in hover-click-handlers, features hooks, api-hooks folder |
| STEP-07 | Frontend catch-all remainder (MAINT-08a/b/f) | **144** | ✓ | Tools, Bottom lists (overlap DUP-08), misc Common UI — A2 then selective A3. |
| STEP-08 | ArcGIS + remaining duplication + admin + arch tail | **148** | ✓ | MAINT-05 ArcGIS helpers |

### Step details

#### STEP-01 — DUP-01 wizard buttons + A1 interfacing sweep (254 RAW)

- **Tactic:** Part A: extract shared WizardButtonBar / step action patterns (DUP-01). Part B: every remaining Unit interfacing finding → single input object or class fields (≤2 params). Backend mostly done in E4→E5.
- **Verify:** Duplication −166; Unit interfacing → 0; Voorbereiding + full build smoke
- **Depends on:** —

#### STEP-02 — Voorbereiding complexity (MAINT-03) (188 RAW)

- **Tactic:** A2 on highest McCabe units: SelectFromSource (54), ImportVluchtPlan (39), GeometriesList, DrawingTool. Use lookup tables / early returns; no naive extract-to-helper.
- **Verify:** MAINT-03 RAW −175; Voorbereiding wizard smoke
- **Depends on:** STEP-01

#### STEP-03 — Backend complexity + size (MAINT-01) (245 RAW)

- **Tactic:** A2 on backend routes/services (getPoints, postProxyHandler, devices-updates). A3 only where extractions stay ≤2 params and ≤5 McCabe. No file moves.
- **Verify:** MAINT-01 RAW −236; backend build + route smoke
- **Depends on:** STEP-01

#### STEP-04 — Architecture — api-hooks factory (ARCH-03) (94 RAW)

- **Tactic:** B2: consolidate const/lookup api-hooks (~21) into useLookupQuery(resource) factory; biggest architecture star lever.
- **Verify:** Component independence RAW −113; frontend build + const dropdown smoke
- **Depends on:** STEP-01

#### STEP-05 — Nabewerking + Timeslider (MAINT-02 + MAINT-07) (156 RAW)

- **Tactic:** A2 on EditPointCoordinates (46), generatePdfReport (26), useTimesliderImagePageData (46), TimesliderItemDetailPage.
- **Verify:** MAINT-02+07 RAW −136; Nabewerking + timeslider smoke
- **Depends on:** STEP-02

#### STEP-06 — Map hooks + api-hooks slice (MAINT-08c + 08d + 08e) (153 RAW)

- **Tactic:** Reduce complexity in hover-click-handlers, features hooks, api-hooks folder; A2 pattern sweeps.
- **Verify:** MAINT-08 slice RAW −144; map interaction smoke
- **Depends on:** STEP-04

#### STEP-07 — Frontend catch-all remainder (MAINT-08a/b/f) (144 RAW)

- **Tactic:** Tools, Bottom lists (overlap DUP-08), misc Common UI — A2 then selective A3.
- **Verify:** MAINT-08 remainder RAW −145
- **Depends on:** STEP-06

#### STEP-08 — ArcGIS + remaining duplication + admin + arch tail (148 RAW)

- **Tactic:** MAINT-05 ArcGIS helpers; DUP-02/07/08 remainder; MAINT-06 admin pages; ARCH-01/02/04 + MAINT-04 long tail.
- **Verify:** 151 findings cleared; map + admin smoke
- **Depends on:** STEP-07

## Work packages (reference — do not PR whole packages at once)

Use the steps above; packages below are for mapping and CSV filters only.

| ID | Phase | Name | Open RAW | Categories (RAW) |
|----|-------|------|----------:|------------------|
| MAINT-01 | 5 - Maintainability | Backend routes and services | 245 | Unit complexity 61, Unit interfacing 21, Unit size 163 |
| MAINT-02 | 5 - Maintainability | Nabewerking flows | 121 | Unit complexity 25, Unit interfacing 22, Unit size 74 |
| MAINT-03 | 5 - Maintainability | Voorbereiding wizards | 188 | Unit complexity 38, Unit interfacing 15, Unit size 135 |
| MAINT-04 | 5 - Maintainability | Map shell UI | 4 | Unit complexity 1, Unit size 3 |
| MAINT-05 | 5 - Maintainability | ArcGIS helpers | 44 | Unit complexity 13, Unit interfacing 9, Unit size 22 |
| MAINT-06 | 5 - Maintainability | Admin standalone pages | 16 | Unit complexity 7, Unit size 9 |
| MAINT-07 | 5 - Maintainability | Timeslider feature | 35 | Unit complexity 13, Unit interfacing 4, Unit size 18 |
| MAINT-08 | 5 - Maintainability | Frontend catch-all | 297 | Unit complexity 83, Unit interfacing 21, Unit size 193 |
| ARCH-01 | 6 - Architecture | High fan-in hooks | 3 | Unit complexity 1, Unit size 2 |
| ARCH-02 | 6 - Architecture | Module coupling | 25 | Module coupling 25 |
| ARCH-03 | 6 - Architecture | Component independence | 94 | Component independence 94 |
| ARCH-04 | 6 - Architecture | Component entanglement | 9 | Component entanglement 9 |

## MAINT-08 sub-slices (used by STEP-06 / STEP-07)

| Slice | RAW (exported-findings-6) | Paths |
|-------|----------:|-------|
| 08a-tools | 37 | `HomePage/Body/Left/Tools/` |
| 08b-bottom | 32 | `HomePage/Body/Bottom/`, overlaps DUP-08 |
| 08c-map-hooks | 50 | `src/hooks/hover-click-handlers/`, `src/hooks/features/` |
| 08d-api-hooks | 57 | `src/api-hooks/`, `src/hooks/` |
| 08d-utils | 9 | `src/utils/` |
| 08e-hooks-other | 37 | other `src/hooks/` |
| 08f-misc | 75 | remaining MAINT-08 |


## Top HIGH-priority units (within current step scope)

| WP | Severity | LOC | Cplx | File | Unit |
|----|----------|----:|-----:|------|------|
| MAINT-04 | HIGH | 153 | 37 | `src/Components/HomePage/Body/MapViewComp/MapComp.tsx` | MapComp.tsx.MapComp(any) |
| MAINT-04 | HIGH | 153 | 37 | `src/Components/HomePage/Body/MapViewComp/MapComp.tsx` | MapComp.tsx.MapComp(any) |
| MAINT-02 | HIGH | 153 | 34 | `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordinates.ts` | useEditPointCoordinates.ts.useEditPointCoordinates |
| MAINT-02 | HIGH | 153 | 34 | `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordinates.ts` | useEditPointCoordinates.ts.useEditPointCoordinates |
| MAINT-07 | HIGH | 65 | 34 | `src/Components/TimesliderItemDetailPage/useTimesliderImagePageData.ts` | useTimesliderImagePageData.ts.useTimesliderImagePa |
| MAINT-07 | HIGH | 65 | 34 | `src/Components/TimesliderItemDetailPage/useTimesliderImagePageData.ts` | useTimesliderImagePageData.ts.useTimesliderImagePa |
| MAINT-03 | HIGH | 118 | 20 | `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/index.tsx` | index.tsx.SelectFromSource(any) |
| MAINT-05 | HIGH | 72 | 20 | `src/helpers/ArcGISHelpers/createGeometryGraphic.ts` | createGeometryGraphic.ts.createGeometryGraphic(Bas |
| MAINT-02 | HIGH | 110 | 16 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/useHandleStep2/processGeometry.ts` | processGeometry.ts.processGeometry(ProcessGeometry |
| MAINT-03 | HIGH | 63 | 16 | `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/index.tsx` | index.tsx.ViewPlan(any) |
| MAINT-02 | HIGH | 75 | 15 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/Steps/Step2/hooks/useRenderGeometries.ts` | useRenderGeometries.ts.useRenderGeometries(Finishe |
| MAINT-08 | HIGH | 111 | 14 | `src/Components/HomePage/Body/Left/Tools/AandachtspuntenVerwijderen/Actions/EditPointDetails/Steps/Step2/Step2Sub1.tsx` | Step2Sub1.tsx.Step2Sub1(any) |
| MAINT-03 | HIGH | 104 | 14 | `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Common/StepContent.tsx` | StepContent.tsx.StepContent(StepContentProps) |
| MAINT-07 | HIGH | 90 | 14 | `src/helpers/timeslider/flightPlansYellowHighlights.ts` | flightPlansYellowHighlights.ts.drawSelectedPlansYe |
| MAINT-02 | HIGH | 74 | 14 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/useHandleStep2/index.ts` | handleStep2() |
| MAINT-03 | HIGH | 88 | 13 | `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/AddPointToPlan/index.tsx` | index.tsx.AddPointToPlan() |
| MAINT-08 | HIGH | 73 | 13 | `src/Components/HomePage/Body/Left/Tools/AandachtspuntenVerwijderen/Actions/Main/index.tsx` | index.tsx.Main() |
| MAINT-03 | HIGH | 61 | 13 | `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx` | GeometriesList.tsx.GeometriesList(any) |
| MAINT-02 | HIGH | 105 | 12 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/useHandleStep2/processPoint.ts` | processPoint.ts.processPoint(ProcessPointParams) |
| MAINT-08 | HIGH | 81 | 12 | `src/hooks/popUpModal/usePopupController.ts` | usePopupController.ts.usePopupController(void) |
| MAINT-07 | HIGH | 97 | 11 | `src/Components/HomePage/Head/HeadButtonsTimeslider.tsx` | HeadButtonsTimeslider.tsx.HeadButtonsTimeslider() |
| MAINT-02 | HIGH | 98 | 10 | `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/useImageMarkersOnMap.ts` | useImageMarkersOnMap.ts.useImageMarkersOnMap(Finis |
| MAINT-02 | HIGH | 87 | 10 | `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditGeometryDetails/Actions/Form/index.tsx` | handleUpdate() |
| MAINT-05 | HIGH | 71 | 9 | `src/helpers/ArcGISHelpers/createGeometryGraphic.ts` | createGeometryGraphic.ts |
| MAINT-03 | HIGH | 67 | 9 | `src/Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/index.tsx` | index.tsx.EnrichedAddPoint() |

## Principles

1. **One step = ≥100 findings cleared** — not one file, not one MAINT package slice.
2. **Pattern sweeps within a step** (A1 object params, A2 McCabe ≤5, DUP extract) — not hero refactors.
3. **No file moves for score** — helpers reorg in E4→E5 caused size/complexity churn with zero star gain.
4. **Re-export Sigrid after each step** → `python sigrid-findings/plan/generate-plan.py` + `python sigrid-findings/compare-5-vs-6.py` (update folder names).

## Files

| File | Contents |
|------|----------|
| `maint-arch-EXECUTION-STEPS.csv` | STEP-01…08 with open RAW counts |
| `maint-arch-00-work-packages.csv` | MAINT-01…08 and ARCH-01…04 definitions |
| `maint-arch-01-findings-mapping.csv` | Every finding mapped to a work package |
| `maint-arch-MASTER-action-items.csv` | HIGH severity RAW — units to hit inside current step |
| `../plan-02-maintainability-mapping.csv` | Same mappings (includes DUP/WP-06 overlaps) |
