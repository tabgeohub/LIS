# Export 6 → 7: both stars moved, net RAW finally dropped

**Dashboard delta:** Maintainability **3.1 → 3.2** (+0.1) · Architecture **~2.2 → 2.3** (+0.1) · Security 4.1 · Reliability 5.5 · OSS 4.7

Run `python sigrid-findings/compare-exports-pair.py` against archived pair folders (historical; E6 removed from disk) or use the narrative below.

## RAW finding counts

| Category | E6 | E7 | Δ |
|----------|---:|---:|---:|
| Unit size | 622 | 626 | **+4** |
| Unit complexity | 243 | 232 | **−11** |
| Unit interfacing | 92 | 92 | 0 |
| Module coupling | 25 | 27 | +2 |
| Component independence | 95 | 97 | +2 |
| Component entanglement | 9 | 9 | 0 |
| Duplication | 209 | 191 | **−18** |
| **Maint + Arch total (CSV)** | **1086** | **1083** | **−3** |
| Maint + Arch (plan-mapped) | 1081 | 1078 | **−3** |
| **All categories** | **1298** | **1278** | **−20** |

## Unique findings (file + unit + description)

| | Count |
|--|------:|
| Cleared (in E6, gone in E7) | **91** |
| New (in E7, not in E6) | **88** |
| Unchanged overlap | 995 |

Net unique: **−3** — matches CSV maint+arch delta. Unlike E5→E6, extractions did not outpace clearance.

## Severity shift (why both stars moved)

| Severity (maint+arch) | E6 | E7 | Δ |
|-----------------------|---:|---:|---:|
| **HIGH** | 79 | **73** | **−6** |
| MEDIUM | 331 | 328 | −3 |
| LOW | 676 | 682 | +6 |

STEPS 07–08 cleared **6 more HIGH** units while duplication dropped **−18**. Complexity **−11** without the E5→E6 size inflation pattern (+51). Architecture star gained alongside maintainability — duplication and admin/API extractions helped structural metrics too.

## What worked (STEPS 07–08)

| Area | Evidence |
|------|----------|
| **DUP-08 table exports** | Duplication **209 → 191** (−18); `pointsPlansTableExport.ts` consolidated CSV/XLSX/SHP |
| **MapComp (MAINT-04)** | McCabe 37 unit cleared; `useMapHoverHighlight` + `mapRegionGoTo` |
| **ArcGIS (MAINT-05)** | `createPointGraphic`, `createGeometryGraphic`, `bufferGraphics`, `geometryPathFromPoints` complexity down |
| **Admin (MAINT-06)** | `DevicesUpdatesPage`, `InstallationsPage` — complexity cleared (−4 each) |
| **Plan images (DUP-08)** | `useEntityPlanImages` + shared `SelectedPlanImagesPanel` |
| **nnederlandLayers** | 385 LOC unit split via `nnederlandLayerBuilders` + icons |
| **Dashboard** | `keycloakUserApi` shared between Add/Edit user |

## Extraction trade-off (improved vs E5→E6)

| Metric | E5→E6 | E6→E7 |
|--------|------:|------:|
| Unit size Δ | **+51** | **+4** |
| Unit complexity Δ | +3 | **−11** |
| Duplication Δ | −5 | **−18** |
| HIGH Δ | −49 | −6 |
| Net maint+arch RAW | **+28** | **−3** |

Helpers stayed smaller this round; shared extractions (table export, plan images, Keycloak API) cleared duplication without spawning large new units.

## Top cleared files (maint+arch)

| File | Cleared |
|------|--------:|
| `PointsList.tsx` | −5 |
| `EditGeometry/index.tsx` | −4 |
| `DevicesUpdatesPage/index.tsx` | −4 |
| `ListPointsFunctions/index.tsx` | −3 |
| `InstallationsPage/index.tsx` | −3 |
| `usePointPlanImages.ts` / `useGeometryPlanImages.ts` | −2 each |
| `createPointGraphic.ts` / `createGeometryGraphic.ts` | −2 each |

## Plan status (export 7)

- **STEPS 01–08:** all implemented and deployed — **both stars +0.1** confirmed.
- **73 HIGH** maint+arch remain — next work should target these, not new ≥100-finding steps from the old 8-step plan.
- Regenerate: `python sigrid-findings/plan/generate-plan.py` (defaults to `exported-findings-7`).
- Compare script: `compare-exports-pair.py` (for next export pair; E6 folder no longer on disk).

## Corrective actions going forward

1. **Target remaining 73 HIGH units** — `useEditPointCoordinates`, `useTimesliderImagePageData`, `SelectFromSource`, Nabewerking `processGeometry`/`processPoint`, Voorbereiding wizards.
2. **Duplication still 191 RAW** — DUP-02 flight-plan form fields, DUP-07 zustand slices, remaining PointsList variants.
3. **Architecture** — component independence ticked up +2; avoid hook sprawl when extracting; prefer factory/consolidation (ARCH-03 pattern).
4. **Batch by pattern** — group next fixes into ≥50-finding sweeps (HIGH McCabe, DUP-02 forms) since the original 8 steps are complete.
