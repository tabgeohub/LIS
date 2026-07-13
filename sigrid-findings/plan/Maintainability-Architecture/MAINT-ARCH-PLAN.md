# Maintainability & Architecture Plan

**Source:** `exported-findings-7` · **Generated:** 2026-07-13

**1078 RAW** maintainability + architecture findings in `exported-findings-7`.

## Progress (STEPS 01–08 complete)

| Step | Status | Outcome |
|------|--------|---------------|
| STEP-01 | Done | WizardButtonBar + A1 interfacing |
| STEP-02 | Done | Voorbereiding complexity sweeps |
| STEP-03 | Done | Backend routes/services |
| STEP-04 | Done | api-hooks factory |
| STEP-05 | Done | Nabewerking + Timeslider |
| STEP-06 | Done | Map hooks + popUpModal |
| STEP-07 | Done | Tools, Bottom lists, table exports; dup −18 |
| STEP-08 | Done | ArcGIS, admin, MapComp; complexity −11 |

Last measured (E6→E7): HIGH **79 → 73** (−6) · maint+arch RAW **−3** · duplication **209 → 191** (−18). See [ANALYSIS-export-6-to-7.md](./ANALYSIS-export-6-to-7.md).

> **Next phase:** remaining **HIGH** units (`maint-arch-MASTER-action-items.csv`) + DUP tails (DUP-01, DUP-07, residual DUP-02/04/05/06/08). Deploy → **export-8** → re-count.

> **Read first:** [STRATEGY.md](./STRATEGY.md) · [ANALYSIS-export-6-to-7.md](./ANALYSIS-export-6-to-7.md)

## Finding counts (code only)

| Category | RAW |
|----------|----:|
| Unit size | 623 |
| Unit complexity | 231 |
| Unit interfacing | 92 |
| Module coupling | 27 |
| Component independence | 96 |
| Component entanglement | 9 |
| **Total in this plan** | **1078** |

## Execution steps (≥100 findings each) — historical scopes

**Rule:** After each batch, deploy and re-export. Small 20–30 finding batches are too slow to move stars.

> **Note:** Step RAW counts below are **E7 scopes**. STEPS 01–08 are **complete**. Use as reference only; next work is HIGH + DUP tails.

| Step | Name | Open RAW (E7) | Size | Primary tactic |
|------|------|--------------:|:----:|----------------|
| STEP-01 | DUP-01 wizard buttons + A1 interfacing sweep | **254** | ✓ | Part A: extract shared WizardButtonBar / step action patterns (DUP-01). Part B: every remaining Unit interfacing finding → single input object or class fields (≤2 params). Backend mostly done in E4→E5. |
| STEP-02 | Voorbereiding complexity (MAINT-03) | **189** | ✓ | A2 on highest McCabe units: SelectFromSource (54), ImportVluchtPlan (39), GeometriesList, DrawingTool. Use lookup tables / early returns |
| STEP-03 | Backend complexity + size (MAINT-01) | **245** | ✓ | A2 on backend routes/services (getPoints, postProxyHandler, devices-updates). A3 only where extractions stay ≤2 params and ≤5 McCabe. No file moves. |
| STEP-04 | Architecture — api-hooks factory (ARCH-03) | **96** | ⚠ | B2: consolidate const/lookup api-hooks (~21) into useLookupQuery(resource) factory |
| STEP-05 | Nabewerking + Timeslider (MAINT-02 + MAINT-07) | **156** | ✓ | A2 on EditPointCoordinates (46), generatePdfReport (26), useTimesliderImagePageData (46), TimesliderItemDetailPage. |
| STEP-06 | Map hooks + api-hooks slice (MAINT-08c + 08d + 08e) | **152** | ✓ | Reduce complexity in hover-click-handlers, features hooks, api-hooks folder |
| STEP-07 | Frontend catch-all remainder (MAINT-08a/b/f) | **149** | ✓ | Tools, Bottom lists (overlap DUP-08), misc Common UI — A2 then selective A3. |
| STEP-08 | ArcGIS + remaining duplication + admin + arch tail | **120** | ✓ | MAINT-05 ArcGIS helpers |

### Step details

#### STEP-01 — DUP-01 wizard buttons + A1 interfacing sweep (254 RAW)

- **Tactic:** Part A: extract shared WizardButtonBar / step action patterns (DUP-01). Part B: every remaining Unit interfacing finding → single input object or class fields (≤2 params). Backend mostly done in E4→E5.
- **Verify:** Duplication −166; Unit interfacing → 0; Voorbereiding + full build smoke
- **Depends on:** —

#### STEP-02 — Voorbereiding complexity (MAINT-03) (189 RAW)

- **Tactic:** A2 on highest McCabe units: SelectFromSource (54), ImportVluchtPlan (39), GeometriesList, DrawingTool. Use lookup tables / early returns; no naive extract-to-helper.
- **Verify:** MAINT-03 RAW −175; Voorbereiding wizard smoke
- **Depends on:** STEP-01

#### STEP-03 — Backend complexity + size (MAINT-01) (245 RAW)

- **Tactic:** A2 on backend routes/services (getPoints, postProxyHandler, devices-updates). A3 only where extractions stay ≤2 params and ≤5 McCabe. No file moves.
- **Verify:** MAINT-01 RAW −236; backend build + route smoke
- **Depends on:** STEP-01

#### STEP-04 — Architecture — api-hooks factory (ARCH-03) (96 RAW)

- **Tactic:** B2: consolidate const/lookup api-hooks (~21) into useLookupQuery(resource) factory; biggest architecture star lever.
- **Verify:** Component independence RAW −113; frontend build + const dropdown smoke
- **Depends on:** STEP-01

#### STEP-05 — Nabewerking + Timeslider (MAINT-02 + MAINT-07) (156 RAW)

- **Tactic:** A2 on EditPointCoordinates (46), generatePdfReport (26), useTimesliderImagePageData (46), TimesliderItemDetailPage.
- **Verify:** MAINT-02+07 RAW −136; Nabewerking + timeslider smoke
- **Depends on:** STEP-02

#### STEP-06 — Map hooks + api-hooks slice (MAINT-08c + 08d + 08e) (152 RAW)

- **Tactic:** Reduce complexity in hover-click-handlers, features hooks, api-hooks folder; A2 pattern sweeps.
- **Verify:** MAINT-08 slice RAW −144; map interaction smoke
- **Depends on:** STEP-04

#### STEP-07 — Frontend catch-all remainder (MAINT-08a/b/f) (149 RAW)

- **Tactic:** Tools, Bottom lists (overlap DUP-08), misc Common UI — A2 then selective A3.
- **Verify:** MAINT-08 remainder RAW −145
- **Depends on:** STEP-06

#### STEP-08 — ArcGIS + remaining duplication + admin + arch tail (120 RAW)

- **Tactic:** MAINT-05 ArcGIS helpers; DUP-02/07/08 remainder; MAINT-06 admin pages; ARCH-01/02/04 + MAINT-04 long tail.
- **Verify:** 151 findings cleared; map + admin smoke
- **Depends on:** STEP-07

## Work packages (reference — do not PR whole packages at once)

Use HIGH + DUP next phase; packages below are for mapping and CSV filters only.

| ID | Phase | Name | Open RAW | Categories (RAW) |
|----|-------|------|----------:|------------------|
| MAINT-01 | 5 - Maintainability | Backend routes and services | 245 | Unit complexity 61, Unit interfacing 21, Unit size 163 |
| MAINT-02 | 5 - Maintainability | Nabewerking flows | 122 | Unit complexity 25, Unit interfacing 22, Unit size 75 |
| MAINT-03 | 5 - Maintainability | Voorbereiding wizards | 189 | Unit complexity 38, Unit interfacing 15, Unit size 136 |
| MAINT-04 | 5 - Maintainability | Map shell UI | 2 | Unit size 2 |
| MAINT-05 | 5 - Maintainability | ArcGIS helpers | 46 | Unit complexity 13, Unit interfacing 9, Unit size 24 |
| MAINT-06 | 5 - Maintainability | Admin standalone pages | 4 | Unit size 4 |
| MAINT-07 | 5 - Maintainability | Timeslider feature | 34 | Unit complexity 12, Unit interfacing 4, Unit size 18 |
| MAINT-08 | 5 - Maintainability | Frontend catch-all | 301 | Unit complexity 81, Unit interfacing 21, Unit size 199 |
| ARCH-01 | 6 - Architecture | High fan-in hooks | 3 | Unit complexity 1, Unit size 2 |
| ARCH-02 | 6 - Architecture | Module coupling | 27 | Module coupling 27 |
| ARCH-03 | 6 - Architecture | Component independence | 96 | Component independence 96 |
| ARCH-04 | 6 - Architecture | Component entanglement | 9 | Component entanglement 9 |

## MAINT-08 sub-slices (historical STEP-06 / STEP-07)

| Slice | RAW (exported-findings-7) | Paths |
|-------|----------:|-------|
| 08a-tools | 39 | `HomePage/Body/Left/Tools/` |
| 08b-bottom | 25 | `HomePage/Body/Bottom/`, overlaps DUP-08 |
| 08c-map-hooks | 50 | `src/hooks/hover-click-handlers/`, `src/hooks/features/` |
| 08d-api-hooks | 56 | `src/api-hooks/`, `src/hooks/` |
| 08d-utils | 9 | `src/utils/` |
| 08e-hooks-other | 37 | other `src/hooks/` |
| 08f-misc | 85 | remaining MAINT-08 |


## Top HIGH-priority units (next phase)

| WP | Severity | LOC | Cplx | File | Unit |
|----|----------|----:|-----:|------|------|
| MAINT-02 | HIGH | 153 | 34 | `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordinates.ts` | useEditPointCoordinates.ts.useEditPointCoordinates |
| MAINT-02 | HIGH | 153 | 34 | `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditPointDetails/Actions/EditPointCoordinates/useEditPointCoordinates.ts` | useEditPointCoordinates.ts.useEditPointCoordinates |
| MAINT-07 | HIGH | 65 | 34 | `src/Components/TimesliderItemDetailPage/useTimesliderImagePageData.ts` | useTimesliderImagePageData.ts.useTimesliderImagePa |
| MAINT-07 | HIGH | 65 | 34 | `src/Components/TimesliderItemDetailPage/useTimesliderImagePageData.ts` | useTimesliderImagePageData.ts.useTimesliderImagePa |
| MAINT-03 | HIGH | 118 | 20 | `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/AddPointsFromPlan/SelectFromSource/index.tsx` | index.tsx.SelectFromSource(any) |
| MAINT-02 | HIGH | 110 | 16 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/useHandleStep2/processGeometry.ts` | processGeometry.ts.processGeometry(ProcessGeometry |
| MAINT-03 | HIGH | 63 | 16 | `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/index.tsx` | index.tsx.ViewPlan(any) |
| MAINT-02 | HIGH | 75 | 15 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/Steps/Step2/hooks/useRenderGeometries.ts` | useRenderGeometries.ts.useRenderGeometries(Finishe |
| MAINT-03 | HIGH | 104 | 14 | `src/Components/HomePage/Body/Left/Voorbereiding/AddPointsVluchtPlan/Common/StepContent.tsx` | StepContent.tsx.StepContent(StepContentProps) |
| MAINT-02 | HIGH | 74 | 14 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/useHandleStep2/index.ts` | handleStep2() |
| MAINT-03 | HIGH | 88 | 13 | `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/AddPointToPlan/index.tsx` | index.tsx.AddPointToPlan() |
| MAINT-03 | HIGH | 61 | 13 | `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx` | GeometriesList.tsx.GeometriesList(any) |
| MAINT-02 | HIGH | 105 | 12 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/useHandleStep2/processPoint.ts` | processPoint.ts.processPoint(ProcessPointParams) |
| MAINT-08 | HIGH | 81 | 12 | `src/hooks/popUpModal/usePopupController.ts` | usePopupController.ts.usePopupController(void) |
| MAINT-07 | HIGH | 97 | 11 | `src/Components/HomePage/Head/HeadButtonsTimeslider.tsx` | HeadButtonsTimeslider.tsx.HeadButtonsTimeslider() |
| MAINT-02 | HIGH | 98 | 10 | `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/common/Foto/useImageMarkersOnMap.ts` | useImageMarkersOnMap.ts.useImageMarkersOnMap(Finis |
| MAINT-02 | HIGH | 87 | 10 | `src/Components/HomePage/Body/Left/Nabewerking/VluchtenZoeken/Steps/Step2/Actions/Waarnemingen/EditGeometryDetails/Actions/Form/index.tsx` | handleUpdate() |
| MAINT-07 | HIGH | 81 | 10 | `src/helpers/timeslider/flightPlansYellowHighlights.ts` | flightPlansYellowHighlights.ts.drawSelectedPlansYe |
| MAINT-03 | HIGH | 67 | 9 | `src/Components/HomePage/Body/Left/Voorbereiding/EnrichedAddPoint/index.tsx` | index.tsx.EnrichedAddPoint() |
| MAINT-03 | HIGH | 87 | 8 | `src/Components/HomePage/Body/Left/Voorbereiding/SelectedPoint/EditPointDetails/Steps/Step2/Step2Sub1.tsx` | Step2Sub1.tsx.Step2Sub1(any) |
| MAINT-01 | HIGH | 70 | 8 | `backend/src/routes/installers.ts` | installers.ts |
| MAINT-03 | HIGH | 65 | 8 | `src/Components/HomePage/Body/Left/Voorbereiding/ViewPlan/Steps/AddPointStep/index.tsx` | index.tsx.AddPointStep() |
| MAINT-03 | HIGH | 71 | 7 | `src/Components/HomePage/Body/Left/Voorbereiding/SelectedPoint/SelectedPointDetails/index.tsx` | index.tsx.SelectedPointDetails() |
| MAINT-03 | HIGH | 62 | 7 | `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Steps/Step3/Buttons.tsx` | handleSubmit() |
| MAINT-08 | HIGH | 61 | 7 | `src/Components/HomePage/Body/MapViewComp/useMapHoverHighlight.ts` | useMapHoverHighlight.ts.useMapHoverHighlight() |

## Principles

1. **Prefer batches that can move stars** — not one-file hero refactors.
2. **Pattern sweeps** (A1 object params, A2 McCabe ≤5, DUP extract).
3. **No file moves for score** — helpers reorg caused size/complexity churn with zero star gain.
4. **Re-export after each batch** → `python sigrid-findings/plan/generate-plan.py` + `python sigrid-findings/compare-exports-pair.py`.

## Files

| File | Contents |
|------|----------|
| `maint-arch-EXECUTION-STEPS.csv` | STEP-01…08 with open RAW counts (historical) |
| `maint-arch-00-work-packages.csv` | MAINT-01…08 and ARCH-01…04 definitions |
| `maint-arch-01-findings-mapping.csv` | Every finding mapped to a work package |
| `maint-arch-MASTER-action-items.csv` | HIGH severity RAW — next phase targets |
| `../plan-02-maintainability-mapping.csv` | Same mappings (includes DUP/WP-06 overlaps) |
