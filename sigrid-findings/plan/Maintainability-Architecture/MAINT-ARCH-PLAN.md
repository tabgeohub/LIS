# Maintainability & Architecture Plan

**Source:** `exported-findings-3` · **Generated:** 2026-06-30

Split from the former single **DEFER** bucket (1061 RAW maintainability + architecture findings in export 3).

**Related:** duplication work (DUP-01…) clears overlapping units in Voorbereiding/Nabewerking — do duplication first where noted.

## Finding counts (code only)

| Category | RAW |
|----------|----:|
| Unit size | 557 |
| Unit complexity | 235 |
| Unit interfacing | 123 |
| Module coupling | 24 |
| Component independence | 113 |
| Component entanglement | 9 |
| **Total in this plan** | **1061** |

## Recommended order

```
1. Finish DUP-01 / DUP-02 / DUP-07 / DUP-08  (overlap with MAINT-02/03/08)
2. MAINT-01  Backend heavy routes
3. MAINT-02  Nabewerking monsters
4. MAINT-03  Voorbereiding (remaining after DUP)
5. MAINT-06  Admin pages (low risk)
6. MAINT-07  Timeslider
7. MAINT-04 + MAINT-05  Map shell + ArcGIS (pair with map QA)
8. MAINT-08  Frontend catch-all — one sub-slice per PR (see below)
9. ARCH-01–04  Incremental / long-term
```

## Work packages

| ID | Phase | Name | Open RAW | Categories (RAW) |
|----|-------|------|----------:|------------------|
| MAINT-01 | 5 - Maintainability | Backend routes and services | 245 | Unit complexity 62, Unit interfacing 48, Unit size 135 |
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

## MAINT-08 sub-slices (one PR each)

| Slice | Area | ~RAW | Paths |
|-------|------|-----:|-------|
| MAINT-08a | Tools | ~37 | `HomePage/Body/Left/Tools/` |
| MAINT-08b | Bottom lists | ~32 | `HomePage/Body/Bottom/`, overlaps DUP-08 |
| MAINT-08c | Map interaction hooks | ~77 | `src/hooks/hover-click-handlers/`, `src/hooks/features/` |
| MAINT-08d | Common UI + misc | ~146 | `HomePage/Body/Left/Common/`, `api-hooks/`, `utils/` |

## Top HIGH-priority units (start here within each package)

| WP | Severity | LOC | Cplx | File | Unit |
|----|----------|----:|-----:|------|------|
| MAINT-01 | HIGH | 174 | 72 | `backend/src/routes/finished_plans/createFinishedPlan.ts` | createFinishedPlan.ts.createFinishedPlan(Request,R |
| MAINT-01 | HIGH | 174 | 72 | `backend/src/routes/finished_plans/createFinishedPlan.ts` | createFinishedPlan.ts.createFinishedPlan(Request,R |
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
| MAINT-01 | HIGH | 60 | 39 | `backend/src/services/arcgis.ts` | arcgis.ts.initArcgisToken(ArcgisTokenConfig) |
| MAINT-01 | HIGH | 166 | 37 | `backend/src/routes/points/createPointFromImport.ts` | createPointFromImport.ts.createPointFromImport(Req |
| MAINT-01 | HIGH | 166 | 37 | `backend/src/routes/points/createPointFromImport.ts` | createPointFromImport.ts.createPointFromImport(Req |
| MAINT-04 | HIGH | 153 | 37 | `src/Components/HomePage/Body/MapViewComp/MapComp.tsx` | MapComp.tsx.MapComp(any) |
| MAINT-04 | HIGH | 153 | 37 | `src/Components/HomePage/Body/MapViewComp/MapComp.tsx` | MapComp.tsx.MapComp(any) |
| MAINT-01 | HIGH | 37 | 33 | `backend/src/routes/auth/authKeycloak/meHandler.ts` | meHandler.ts.meHandler(any,any) |
| MAINT-01 | HIGH | 21 | 31 | `backend/src/helpers/queries/pointFields.ts` | PointCorePayload.normalizePointCoreFields(PointCor |
| MAINT-03 | HIGH | 94 | 29 | `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx` | GeometriesList.tsx.GeometriesList(any) |
| MAINT-03 | HIGH | 94 | 29 | `src/Components/HomePage/Body/Left/Voorbereiding/FlightPlan/Common/GeometriesList.tsx` | GeometriesList.tsx.GeometriesList(any) |
| MAINT-02 | HIGH | 205 | 26 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/generatePdfReport.ts` | generatePdfReport.ts.generatePdfReport(PDFPointDat |
| MAINT-02 | HIGH | 205 | 26 | `src/Components/HomePage/Body/Left/Nabewerking/CreateReport/helpers/generatePdfReport.ts` | generatePdfReport.ts.generatePdfReport(PDFPointDat |
| MAINT-08 | HIGH | 71 | 25 | `src/hooks/hover-click-handlers/usePathPointHandlerClick.ts` | usePathPointHandlerClick.ts.usePathPointHandlerCli |
| MAINT-08 | HIGH | 66 | 25 | `src/hooks/hover-click-handlers/useDrawPath.ts` | useDrawPath.ts.useDrawPath(boolean) |

## Principles

1. **One PR = one file cluster or MAINT-08 sub-slice** — not the whole package at once.
2. **Prioritize files with both size and complexity** findings (see mapping CSV).
3. **Architecture (ARCH-*)** — expect slower dashboard movement; entanglement needs boundary work.
4. **Re-export Sigrid** after each phase → `python sigrid-findings/plan/generate-plan.py`

## Files

| File | Contents |
|------|----------|
| `maint-arch-00-work-packages.csv` | MAINT-01…08 and ARCH-01…04 definitions |
| `maint-arch-01-findings-mapping.csv` | Every finding mapped to a work package |
| `maint-arch-MASTER-action-items.csv` | HIGH severity RAW — sprint shortlist |
| `../plan-02-maintainability-mapping.csv` | Same mappings (includes DUP/WP-06 overlaps) |
