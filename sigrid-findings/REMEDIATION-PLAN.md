# Sigrid Findings Remediation Plan — LIS

## Current state

The immutable July 17 export in [`all-findings-rijkswaterstaat-otg-lis-20260717/`](./all-findings-rijkswaterstaat-otg-lis-20260717/) is the **current source of truth**. Earlier on-disk snapshots (`sigrid-findings-new/`, `sigrid-findings-1243/`) are no longer present in this folder; category RAW totals below are counted directly from the July 17 CSVs.

Last quality overview recorded with the prior deployment (still the best dashboard figures available until the next Sigrid UI refresh after this export is ingested):

- Maintainability: 3.6 (+0.80)
- Architecture: 3.3 (+1.04)
- Open Source Health: 4.7 (+0.77)
- Security: 4.3
- Reliability: 5.5

| Category | July 17 RAW | Severity breakdown |
| --- | ---: | --- |
| Duplication | 91 | HIGH 91 |
| Unit size | 671 | HIGH 5; MEDIUM 188; LOW 478 |
| Unit complexity | 245 | MEDIUM 40; LOW 205 |
| Unit interfacing | 47 | MEDIUM 2; LOW 45 |
| Module coupling | 29 | HIGH 2; MEDIUM 13; LOW 14 |
| Component independence | 118 | HIGH 27; MEDIUM 91 |
| Component entanglement | 9 | MEDIUM 2; LOW 7 |
| Security | 3 | HIGH 2; MEDIUM 1 |
| Reliability | 0 | Clean |

**Maintainability + architecture RAW total: 1,210.** Security + reliability open: **3**.

Relative to the last documented July 16 table in this plan, category RAW totals are **unchanged**. Treat July 17 as a re-baseline of the same scoreboard, not as evidence that pending remediations cleared.

All work remains behavior-preserving and uncommitted for review. Do not push, create branches, edit Dockerfiles, edit Nginx or deployment files, change database schemas, or change HTTP contracts.

---

## Phase 0 — Security and reliability

Source: [`Security findings.csv`](./all-findings-rijkswaterstaat-otg-lis-20260717/Security%20findings.csv).

Still **3 RAW** (unchanged):

| Severity | Finding | Location |
| --- | --- | --- |
| HIGH | Missing `USER` (CWE-266) | `dockerfile#L22` |
| HIGH | Missing `USER` (CWE-266) | `backend/dockerfile#L4` |
| MEDIUM | XSS in “HTML string” (CWE-79) | `src/helpers/tableExports/pointsPlansTableExport.ts#L18` |

- The two Docker HIGH findings remain **accepted / out of scope** because deployment files must remain untouched.
- The MEDIUM XSS finding remains a **false positive**: CSV cells are RFC 4180 quoted (`escapeCsvCell` / `buildCsvFromRows`); there is no HTML/DOM sink. Mark false positive in Sigrid UI; do not restructure working CSV logic.
- Reliability remains clean (`Reliability findings.csv`: 0 RAW).

---

## Phase 1 — Remaining HIGH duplication

Sources: [`Duplication findings.csv`](./all-findings-rijkswaterstaat-otg-lis-20260717/Duplication%20findings.csv) and [`Duplicates.csv`](./all-findings-rijkswaterstaat-otg-lis-20260717/Duplicates.csv).

HIGH duplication remains **91** (all RAW rows are HIGH). Largest redundant clusters in this export (by redundant LOC):

1. Shared point / finished-plan field fragments across Types, validators, and `buildPointUpdatePayload` (up to 24 redundant LOC, 5 occurrences).
2. Geometry/point column key sequences (`pointColumnKeys`, backend `geometryJson` / `pointCoreColumns`).
3. Flight-plan form field sequences (`flightPlanFormFields`, `buildUpdatedPlanFromForm`, route query configs).
4. Wizard / edit buttons and plan cards (`EditFlight/Buttons` ↔ `RemovePoint`, `SinglePlan` Nabewerking ↔ Reuse).
5. Same-file / near-duplicate import and popup field blocks.

Implementation order (unchanged intent):

1. Repeated flight-plan button definitions and identical plan/list cards.
2. Point and flight-plan field sequences that remain inside the same build context.
3. Flight-plan route query configurations and status-update route preparation.
4. Table headers/layout blocks and duplicate edit-point wrappers.
5. Remaining same-file export/report builders after the next scan.

Frontend/backend structural types remain accepted across build boundaries. No shared package is introduced during behavior-preserving remediation.

---

## Phase 2 — Unit size

Source: [`Unit size findings.csv`](./all-findings-rijkswaterstaat-otg-lis-20260717/Unit%20size%20findings.csv).

Five HIGH unit-size findings remain **RAW** in July 17:

| Unit | LOC | Disposition |
| --- | ---: | --- |
| `nnederlandLayerSpecsPart3.ts` | 83 | Accepted declarative layer catalogue (McCabe 1) |
| `nnederlandLayerSpecsPart2.ts` | 79 | Accepted declarative layer catalogue (McCabe 1) |
| `nnederlandLayerSpecsPart1.ts` | 78 | Accepted declarative layer catalogue (McCabe 1) |
| `voorbereidingTabs.ts` | 63 | Accepted declarative tab data (McCabe 1) |
| `backend/.../mapLoginError.ts` | 62 | Previously marked addressed; **still HIGH RAW** in July 17 — keep on confirmation backlog / re-check deployed artifact |

MEDIUM (188) and LOW (478) unit-size remain the long-tail split work after HIGH and duplication.

---

## Architecture remediation ledger

Phased architecture-only backlog (await-deploy vs code-next vs accepted): [`ARCHITECTURE-PHASES.md`](./ARCHITECTURE-PHASES.md).

Sources: [`Module coupling findings.csv`](./all-findings-rijkswaterstaat-otg-lis-20260717/Module%20coupling%20findings.csv), [`Component independence findings.csv`](./all-findings-rijkswaterstaat-otg-lis-20260717/Component%20independence%20findings.csv), and [`Component entanglement findings.csv`](./all-findings-rijkswaterstaat-otg-lis-20260717/Component%20entanglement%20findings.csv).

July 17 RAW: coupling **29** (HIGH 2), independence **118** (HIGH 27), entanglement **9**. Category totals did not drop vs the prior documented table, so prior “addressed pending confirmation” items are **not yet confirmed cleared** by this export.

The ledger key is `category + file/description + severity`. Because these exports do not provide stable IDs, every RAW row is covered by the addressed list or the deterministic acceptance rules below.

### Addressed in code — not yet confirmed by July 17

**Component entanglement and ownership**

- Timeslider no longer imports image URLs, types, conversion helpers, or image-loading hooks from HomePage internals. Plan-image access now belongs to a shared `api-hooks/planImages` domain boundary.
- Mutation hooks now belong to `api-hooks/mutations`; the former `utils` modules are compatibility façades.
- `useDebouncedValue` now belongs to shared hooks instead of generic utilities.
- A local architecture check rejects Timeslider-to-HomePage imports, hook/API dependencies on legacy mutation utilities, and imports of pure map helpers through hook paths.

**HIGH component independence**

- `usePlanStarGraphic.ts`: pure plan-star operations moved to ArcGIS helpers; the unused fake hook wrapper was removed.
- `syncBluePointGraphics.ts`: implementation moved to ArcGIS helpers; the old module is a compatibility façade.
- `useMapInitialization.ts`: reduced to lifecycle orchestration; resource creation/store publication moved behind one initialization service.
- `useHerhalenSelectionHandlers.ts`: selection calculation and setter application extracted.
- `useCoordinateSystemSync.ts`: coordinate decision/transformation extracted to a pure helper.
- `useHoverPointsAndGeometries.ts`: pointer registration and hit resolution separated from React lifecycle.
- `useDrawYellowGeometries.ts` and `usePointHover.ts`: graphic construction/cleanup extracted to ArcGIS helpers.

**MEDIUM component independence and coupling**

- `pointsPlansTableExport.ts`: split into CSV, XLSX, GeoJSON, shapefile, and point-feature modules; the original path remains a façade.
- `flightPlanFormFields.ts`: split into types, defaults/labels, value selection, setters, and list-filter modules.
- `createPointGraphic.ts` and `createGeometryGraphic.ts`: types, coordinate resolution, symbols, and construction separated.
- `createPointMapGraphics.ts`: starred-point selection calculations moved to a point-domain helper.
- `useCreateData.ts`, `useUpdateData.ts`, and `useDeleteData.ts`: implementations moved to the mutation API boundary.
- React Query barrels now export directly from their domain query modules instead of routing through generic aggregators.
- `configureExpressApp.ts`: reduced to a composition root; request middleware and route registration are separate backend modules with the original order preserved.

**Pre-deployment maintainability batch**

- `mapLoginError.ts`: response selection and classifier diagnostics are separated from the compatibility facade.
- `grantError.ts` and `validateLoginInput.ts`: direct extraction, embedded JSON parsing, length validation, and OTP validation are focused helpers.
- `SinglePlan.tsx`: point-row preparation and XLSX-buffer construction moved to tested export helpers while filename and logging behavior remain in the component.
- `parsePointImportFile.ts`: column-specific parsing now uses typed handlers without changing supported headers or normalization rules.
- Point coordinate update paths reuse `buildCoordinateSyncPatch`; feature-specific drawing, state updates, and logging remain local.
- `nnederlandLayerBuilders.ts`: the repeated layer-spec envelope is shared while IDs, URLs, titles, ordering, and symbols remain unchanged.

**Final pure maintainability batch**

- `calculateCenterAndZoom.ts`: coordinate validation, averaging, maximum-distance calculation, and zoom thresholds are focused pure helpers with the existing Netherlands fallback and thresholds preserved.
- `geometryHerhalen.ts`: selection sorting uses explicit original and reverse-selection ranks while retaining the existing order.
- `parseTimesliderImageQuery.ts` and `filterPlansByPeriod.ts`: ID/date parsing and period/text predicates are separated without changing query keys, error text, date boundaries, or current filter labels.
- `ViewPlans/Images.tsx`: loading/empty/ready decisions and attachment sorting are separated from presentation; thumbnails and `ImageGallery` now use the shared backend-proxy display URL.

**July 17 confirmation:** none of the category totals above moved. Keep these as “addressed in workspace / awaiting a scan of the deployed artifact,” or reopen if review shows the live tree still matches the finding locations.

### Confirmation gate (workspace vs July 17)

Next Architecture score move depends on scanning the **current tree**. On-disk sizes already undercut several July 17 HIGH/MEDIUM independence rows:

| Module (July 17 LOC) | Workspace LOC (approx.) |
| --- | ---: |
| `usePlanStarGraphic.ts` (53) | ~6 |
| `syncBluePointGraphics.ts` (48) | ~4 |
| `useMapInitialization.ts` (47) | ~14 |
| `pointsPlansTableExport.ts` (251) | ~18 façade |
| `flightPlanFormFields.ts` (127) | ~23 |
| `useUpdateData.ts` (53) | ~2 façade |

After the next deploy/export lands beside `all-findings-rijkswaterstaat-otg-lis-20260717/`, move matching rows from “not yet confirmed” into a confirmed-cleared list. Do **not** re-extract modules that are already thin façades.

**Architecture next code wave (post-gate / parallel):** keep thinning remaining ~30–40 LOC HIGH interface hooks (`useHerhalenSelectionHandlers`, `useCoordinateSystemSync`, `useHoverPointsAndGeometries`, hover cluster) and move lookup/query config out of fat `api-hooks` modules. Leave `useLogAction` / `useContent` and HomePage/hooks communication density accepted.

**Architecture wave applied in workspace (await next export):** HIGH hooks thinned via pure helpers (`createHerhalenSelectionHandlers`, `applyCoordinateSystemSync`, `attachMapHoverLifecycle`, yellow sync/hover/plan handler modules). Lookup/regional/search query config moved to sibling non-hook modules under `api-hooks/`. `npm run check:architecture` green; `useLogAction` / `useContent` / Docker untouched.

**MEDIUM independence wave applied in workspace (await next export):** ArcGIS façades thinned (`createPlanBoundingBoxGraphic`, `createGeometryMapGraphics`, `createPointMapGraphics`, `calculateCenterAndZoom`, `bufferGraphics`); `invalidateAfterMutation` split into flight-plan / related-query / store-refresh helpers; MEDIUM hooks thinned (`useDrawPath`, `useResizableSidebar`, `useFeatureLayerPopup`). Public import paths preserved. `check:architecture` + `test:architecture-helpers` green.

### Accepted architecture findings

These acceptance rules cover every current architecture row not named in the addressed list:

- HIGH coupling in `useLogAction.ts` and `useContent.ts` is accepted. Both are cohesive application services with intentional high fan-in; splitting them would distribute coupling. (July 17 still shows fan-in 98 and 123.)
- Domain query hooks and barrels for flight plans, finished plans, points, templates, constants, attachments, and emails are accepted supported interface boundaries.
- Focused map lifecycle hooks (`useDrawYellowMarkers`, geometry/list hover, plan hover/click, local render, and edit highlight) are accepted after their pure calculations/builders live outside React orchestration.
- Small foundational utilities such as `classNames`, `fetchApi`, `validateMapView`, coordinate transforms, route responses, authentication security logging, and request validation are accepted when they retain one responsibility.
- Pure graphics factories, calculation helpers, query builders, type-only modules, declarative catalogues, entry points, and short compatibility façades are accepted even when fan-in is high.
- `configureExpressApp` is accepted only as the short composition root left after extraction.
- The MEDIUM communication-density rows for `src/Components/HomePage` and `src/hooks`, plus LOW density rows for helpers, utils, api-hooks, and Timeslider, are accepted directory aggregation after cross-feature internals are removed.
- The three LOW layer-bypassing rows (`hooks → utils` and Timeslider → hooks/helpers) are addressed where ownership was incorrect; direct dependency on a genuinely shared hook/helper remains accepted rather than adding a pass-through layer.

An accepted row must be reopened if a future scan or code review shows bundled responsibilities, feature-to-feature internal imports, state ownership leakage, or cyclic dependencies.

---

## Phase 3 — Complexity and parameter count

Sources: [`Unit complexity findings.csv`](./all-findings-rijkswaterstaat-otg-lis-20260717/Unit%20complexity%20findings.csv) and [`Unit interfacing findings.csv`](./all-findings-rijkswaterstaat-otg-lis-20260717/Unit%20interfacing%20findings.csv).

July 17: MEDIUM complexity **40**, LOW **205**; MEDIUM interfacing **2**, LOW **45**.

Highest MEDIUM McCabe still open (examples): `populateFormFromPlan` (19), `SinglePlan.exportExcel` (17), `parsePointImportFile.applyImportColumn` (17), `grantError.extractGrantError` (17), `TimesliderItemDetailPage` (16), `parseLoginInput` (16), `createGeometryGraphic` (15).

The two MEDIUM parameter-count rows are **still RAW** in July 17:

- `finishedPlanHighlightActions.ts.draw(...)` — 5 parameters.
- `geometryGraphicBuilders.ts.pointsToCoordinates(...)` — 5 parameters.

Continue in descending executable complexity. Prefer typed options objects only when ownership and readability improve; preserve compatibility wrappers for exported helpers.

---

## Verification

For each implementation batch:

1. Run `npm run check:architecture`.
2. Run `npm run test:architecture-helpers` for the extracted selection, image-conversion, and form-field helpers.
3. Run the frontend production build outside the restricted environment and run the backend TypeScript build.
4. Run the restored frontend Vitest suite, plus all backend authentication, credential-flow, and Keycloak token tests.
5. Manually verify map hover/click, point and geometry selection, flight-plan workflows, Timeslider, exports, and authentication.
6. Confirm Dockerfiles, Nginx, deployment, and database files have no diff.
7. Run `git diff --check`; leave all work uncommitted and unpushed.
8. Keep every Sigrid export immutable. After the next export lands beside this folder, compare it against **`all-findings-rijkswaterstaat-otg-lis-20260717`** (restore or re-add `compare-exports-pair.py` if needed).

Current baseline limitations:

- The frontend production build requires unrestricted parent-directory access; it passes when run outside the restricted environment.
- Vitest is installed with a dedicated configuration and the frontend test suite passes.
- Standalone frontend `tsc --noEmit` is clean.

## Compatibility rules

- Existing public hook names, barrel imports, Zustand behavior, API routes, request/response shapes, authentication decisions, map symbols, cleanup ownership, UI labels, and export filenames remain unchanged.
- Old internal import paths remain short compatibility façades where repository-wide consumers still use them.
- No frontend/backend shared package, schema migration, deployment edit, commit, push, or branch operation is allowed.
