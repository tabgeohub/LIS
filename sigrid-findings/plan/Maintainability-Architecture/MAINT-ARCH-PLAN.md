# Maintainability & Architecture Plan

**Source:** `exported-findings-5` · **Generated:** 2026-07-01

**1052 RAW** maintainability + architecture findings in `exported-findings-5`.
**Delta vs `exported-findings-4`:** -33 maint+arch RAW (1085 → 1052). Stars may lag until ~300–500 findings cleared.


> **Read first:** [STRATEGY.md](./STRATEGY.md) · [ANALYSIS-export-4-to-5.md](./ANALYSIS-export-4-to-5.md) · [ANALYSIS-export-3-to-4.md](./ANALYSIS-export-3-to-4.md)

## Finding counts (code only)

| Category | RAW |
|----------|----:|
| Unit size | 568 |
| Unit complexity | 239 |
| Unit interfacing | 99 |
| Module coupling | 24 |
| Component independence | 113 |
| Component entanglement | 9 |
| **Total in this plan** | **1052** |

## Execution steps (≥100 findings each)

**Rule:** Do not start the next step until the current one is merged, deployed, and a new Sigrid export confirms the expected drop. Small 20–30 finding batches are too slow to move stars.

> **Note:** Step RAW counts are **scopes at export 5**. STEP-01 combines DUP-01 + Unit interfacing (disjoint categories). Execute **in order** — later steps assume earlier categories are cleared.

| Step | Name | Open RAW (E5) | Size | Primary tactic |
|------|------|--------------:|:----:|----------------|
| STEP-01 | DUP-01 wizard buttons + A1 interfacing sweep | **265** | ✓ | Part A: extract shared WizardButtonBar / step action patterns (DUP-01). Part B: every remaining Unit interfacing finding → single input object or class fields (≤2 params). Backend mostly done in E4→E5. |
| STEP-02 | Voorbereiding complexity (MAINT-03) | **175** | ✓ | A2 on highest McCabe units: SelectFromSource (54), ImportVluchtPlan (39), GeometriesList, DrawingTool. Use lookup tables / early returns |
| STEP-03 | Backend complexity + size (MAINT-01) | **236** | ✓ | A2 on backend routes/services (getPoints, postProxyHandler, devices-updates). A3 only where extractions stay ≤2 params and ≤5 McCabe. No file moves. |
| STEP-04 | Architecture — api-hooks factory (ARCH-03) | **113** | ✓ | B2: consolidate const/lookup api-hooks (~21) into useLookupQuery(resource) factory |
| STEP-05 | Nabewerking + Timeslider (MAINT-02 + MAINT-07) | **136** | ✓ | A2 on EditPointCoordinates (46), generatePdfReport (26), useTimesliderImagePageData (46), TimesliderItemDetailPage. |
| STEP-06 | Map hooks + api-hooks slice (MAINT-08c + 08d + 08e) | **144** | ✓ | Reduce complexity in hover-click-handlers, features hooks, api-hooks folder |
| STEP-07 | Frontend catch-all remainder (MAINT-08a/b/f) | **145** | ✓ | Tools, Bottom lists (overlap DUP-08), misc Common UI — A2 then selective A3. |
| STEP-08 | ArcGIS + remaining duplication + admin + arch tail | **151** | ✓ | MAINT-05 ArcGIS helpers |

### Step details

#### STEP-01 — DUP-01 wizard buttons + A1 interfacing sweep (265 RAW)

- **Tactic:** Part A: extract shared WizardButtonBar / step action patterns (DUP-01). Part B: every remaining Unit interfacing finding → single input object or class fields (≤2 params). Backend mostly done in E4→E5.
- **Verify:** Duplication −166; Unit interfacing → 0; Voorbereiding + full build smoke
- **Depends on:** —

#### STEP-02 — Voorbereiding complexity (MAINT-03) (175 RAW)

- **Tactic:** A2 on highest McCabe units: SelectFromSource (54), ImportVluchtPlan (39), GeometriesList, DrawingTool. Use lookup tables / early returns; no naive extract-to-helper.
- **Verify:** MAINT-03 RAW −175; Voorbereiding wizard smoke
- **Depends on:** STEP-01

#### STEP-03 — Backend complexity + size (MAINT-01) (236 RAW)

- **Tactic:** A2 on backend routes/services (getPoints, postProxyHandler, devices-updates). A3 only where extractions stay ≤2 params and ≤5 McCabe. No file moves.
- **Verify:** MAINT-01 RAW −236; backend build + route smoke
- **Depends on:** STEP-01

#### STEP-04 — Architecture — api-hooks factory (ARCH-03) (113 RAW)

- **Tactic:** B2: consolidate const/lookup api-hooks (~21) into useLookupQuery(resource) factory; biggest architecture star lever.
- **Verify:** Component independence RAW −113; frontend build + const dropdown smoke
- **Depends on:** STEP-01

#### STEP-05 — Nabewerking + Timeslider (MAINT-02 + MAINT-07) (136 RAW)

- **Tactic:** A2 on EditPointCoordinates (46), generatePdfReport (26), useTimesliderImagePageData (46), TimesliderItemDetailPage.
- **Verify:** MAINT-02+07 RAW −136; Nabewerking + timeslider smoke
- **Depends on:** STEP-02

#### STEP-06 — Map hooks + api-hooks slice (MAINT-08c + 08d + 08e) (144 RAW)

- **Tactic:** Reduce complexity in hover-click-handlers, features hooks, api-hooks folder; A2 pattern sweeps.
- **Verify:** MAINT-08 slice RAW −144; map interaction smoke
- **Depends on:** STEP-04

#### STEP-07 — Frontend catch-all remainder (MAINT-08a/b/f) (145 RAW)

- **Tactic:** Tools, Bottom lists (overlap DUP-08), misc Common UI — A2 then selective A3.
- **Verify:** MAINT-08 remainder RAW −145
- **Depends on:** STEP-06

#### STEP-08 — ArcGIS + remaining duplication + admin + arch tail (151 RAW)

- **Tactic:** MAINT-05 ArcGIS helpers; DUP-02/07/08 remainder; MAINT-06 admin pages; ARCH-01/02/04 + MAINT-04 long tail.
- **Verify:** 151 findings cleared; map + admin smoke
- **Depends on:** STEP-07

## Work packages (reference — do not PR whole packages at once)

Use the steps above; packages below are for mapping and CSV filters only.

| ID | Phase | Name | Open RAW | Categories (RAW) |
|----|-------|------|----------:|------------------|
| MAINT-01 | 5 - Maintainability | Backend routes and services | 236 | Unit complexity 66, Unit interfacing 24, Unit size 146 |
| MAINT-02 | 5 - Maintainability | Nabewerking flows | 107 | Unit complexity 24, Unit interfacing 17, Unit size 66 |
| MAINT-03 | 5 - Maintainability | Voorbereiding wizards | 175 | Unit complexity 36, Unit interfacing 16, Unit size 123 |
| MAINT-04 | 5 - Maintainability | Map shell UI | 4 | Unit complexity 1, Unit size 3 |
| MAINT-05 | 5 - Maintainability | ArcGIS helpers | 47 | Unit complexity 13, Unit interfacing 12, Unit size 22 |
| MAINT-06 | 5 - Maintainability | Admin standalone pages | 16 | Unit complexity 7, Unit size 9 |
| MAINT-07 | 5 - Maintainability | Timeslider feature | 29 | Unit complexity 10, Unit interfacing 4, Unit size 15 |
| MAINT-08 | 5 - Maintainability | Frontend catch-all | 289 | Unit complexity 81, Unit interfacing 26, Unit size 182 |
| ARCH-01 | 6 - Architecture | High fan-in hooks | 3 | Unit complexity 1, Unit size 2 |
| ARCH-02 | 6 - Architecture | Module coupling | 24 | Module coupling 24 |
| ARCH-03 | 6 - Architecture | Component independence | 113 | Component independence 113 |
| ARCH-04 | 6 - Architecture | Component entanglement | 9 | Component entanglement 9 |

## MAINT-08 sub-slices (used by STEP-06 / STEP-07)

| Slice | ~RAW (E5) | Paths |
|-------|----------:|-------|
| 08a-tools | 37 | `HomePage/Body/Left/Tools/` |
| 08b-bottom | 32 | `HomePage/Body/Bottom/`, overlaps DUP-08 |
| 08c-map-hooks | 39 | `src/hooks/hover-click-handlers/`, `src/hooks/features/` |
| 08d-api-hooks | 60 | `src/hooks/api-hooks/` |
| 08d-utils | 9 | `src/utils/` |
| 08e-hooks-other | 38 | other `src/hooks/` |
| 08f-misc | 76 | remaining MAINT-08 |

## Top HIGH-priority units (within current step scope)

| WP | Severity | LOC | Cplx | File | Unit |
|----|----------|----:|-----:|------|------|
| MAINT-03 | HIGH | 200 | 54 | `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/index.tsx` | index.tsx.SelectFromSource(any) |
| MAINT-03 | HIGH | 200 | 54 | `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/index.tsx` | index.tsx.SelectFromSource(any) |
| MAINT-02 | HIGH | 225 | 46 | `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/index.tsx` | index.tsx.EditPointCoordinates(any) |
| MAINT-02 | HIGH | 225 | 46 | `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/index.tsx` | index.tsx.EditPointCoordinates(any) |
| MAINT-07 | HIGH | 96 | 46 | `src/Components/TimesliderItemDetailPage/useTimesliderImagePageData.ts` | useTimesliderImagePageData.ts.useTimesliderImagePa |
| MAINT-07 | HIGH | 96 | 46 | `src/Components/TimesliderItemDetailPage/useTimesliderImagePageData.ts` | useTimesliderImagePageData.ts.useTimesliderImagePa |
| MAINT-07 | HIGH | 73 | 45 | `src/Components/TimesliderItemDetailPage/index.tsx` | index.tsx.TimesliderItemDetailPage() |
| MAINT-07 | HIGH | 73 | 45 | `src/Components/TimesliderItemDetailPage/index.tsx` | index.tsx.TimesliderItemDetailPage() |
| MAINT-03 | HIGH | 140 | 39 | `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx` | onload(any) |
| MAINT-03 | HIGH | 140 | 39 | `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Steps/Step1/ImportVluchtPlan.tsx` | onload(any) |
| MAINT-04 | HIGH | 153 | 37 | `src/Components/HomePage/Body/MapViewComp/MapComp.tsx` | MapComp.tsx.MapComp(any) |
| MAINT-04 | HIGH | 153 | 37 | `src/Components/HomePage/Body/MapViewComp/MapComp.tsx` | MapComp.tsx.MapComp(any) |
| MAINT-03 | HIGH | 94 | 29 | `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx` | GeometriesList.tsx.GeometriesList(any) |
| MAINT-03 | HIGH | 94 | 29 | `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx` | GeometriesList.tsx.GeometriesList(any) |
| MAINT-02 | HIGH | 205 | 26 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/generatePdfReport.ts` | generatePdfReport.ts.generatePdfReport(PDFPointDat |
| MAINT-02 | HIGH | 205 | 26 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/generatePdfReport.ts` | generatePdfReport.ts.generatePdfReport(PDFPointDat |
| MAINT-08 | HIGH | 71 | 25 | `src/hooks/hover-click-handlers/usePathPointHandlerClick.ts` | usePathPointHandlerClick.ts.usePathPointHandlerCli |
| MAINT-08 | HIGH | 66 | 25 | `src/hooks/hover-click-handlers/useDrawPath.ts` | useDrawPath.ts.useDrawPath(boolean) |
| MAINT-08 | HIGH | 75 | 23 | `src/hooks/hover-click-handlers/useFeatureLayerLabels.ts` | updateLabels() |
| MAINT-01 | HIGH | 74 | 22 | `backend/src/routes/arcgis/postProxyHandler.ts` | postProxyHandler.ts.arcgisPostProxyHandler(Request |
| MAINT-08 | HIGH | 74 | 22 | `src/hooks/hover-click-handlers/useFeatureLayerPopup.ts` | useFeatureLayerPopup.ts.useFeatureLayerPopup() |
| MAINT-01 | HIGH | 81 | 21 | `backend/src/routes/points/getPoints.ts` | getPoints.ts.getPoints(Request,Response) |
| MAINT-05 | HIGH | 72 | 20 | `src/helpers/ArcGISHelpers/createGeometryGraphic.ts` | createGeometryGraphic.ts.createGeometryGraphic(Bas |
| MAINT-08 | HIGH | 83 | 17 | `src/hooks/features/useRenderGeometries.ts` | useRenderGeometries.ts.useRenderGeometries() |
| MAINT-02 | HIGH | 110 | 16 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/useHandleStep2/processGeometry.ts` | processGeometry.ts.processGeometry(ProcessGeometry |

## Principles

1. **One step = ≥100 findings cleared** — not one file, not one MAINT package slice.
2. **Pattern sweeps within a step** (A1 object params, A2 McCabe ≤5, DUP extract) — not hero refactors.
3. **No file moves for score** — helpers reorg in E4→E5 caused size/complexity churn with zero star gain.
4. **Re-export Sigrid after each step** → `python sigrid-findings/plan/generate-plan.py` + `compare-4-vs-5.py` (update folder names).

## Files

| File | Contents |
|------|----------|
| `maint-arch-EXECUTION-STEPS.csv` | STEP-01…08 with open RAW counts |
| `maint-arch-00-work-packages.csv` | MAINT-01…08 and ARCH-01…04 definitions |
| `maint-arch-01-findings-mapping.csv` | Every finding mapped to a work package |
| `maint-arch-MASTER-action-items.csv` | HIGH severity RAW — units to hit inside current step |
| `../plan-02-maintainability-mapping.csv` | Same mappings (includes DUP/WP-06 overlaps) |
