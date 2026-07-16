# Sigrid Findings Remediation Plan — LIS

## Current state

The July 15 export in [`sigrid-findings-new/`](./sigrid-findings-new/) is the comparison baseline. The immutable July 16 export in [`sigrid-findings-1243/`](./sigrid-findings-1243/) is the current source of truth.

Quality overview reported with the July 16 deployment:

- Maintainability: 3.6 (+0.80)
- Architecture: 3.3 (+1.04)
- Open Source Health: 4.7 (+0.77)
- Security: 4.3
- Reliability: 5.5

| Category | Previous RAW | Current RAW | Current severity |
| --- | ---: | ---: | --- |
| Duplication | 119 | 91 | HIGH 91 |
| Unit size | 683 | 671 | HIGH 5; MEDIUM 188; LOW 478 |
| Unit complexity | 240 | 245 | MEDIUM 40; LOW 205 |
| Unit interfacing | 49 | 47 | MEDIUM 2; LOW 45 |
| Module coupling | 29 | 29 | HIGH 2; MEDIUM 13; LOW 14 |
| Component independence | 113 | 118 | HIGH 27; MEDIUM 91 |
| Component entanglement | 9 | 9 | MEDIUM 2; LOW 7 |
| Security | 3 | 3 | HIGH 2; MEDIUM 1 |
| Reliability | 0 | 0 | Clean |

Across maintainability and architecture categories, 99 findings cleared, 95 appeared or were resegmented, and total RAW findings fell from 1,123 to 1,119. HIGH duplication fell by 28, from 119 to 91. Clone IDs remain the authoritative way to reconcile duplication; line movement can resegment IDs.

All work remains behavior-preserving and uncommitted for review. Do not push, create branches, edit Dockerfiles, edit Nginx or deployment files, change database schemas, or change HTTP contracts.

---

## Phase 0 — Security and reliability

Source: [`Security findings.csv`](./sigrid-findings-1243/Security%20findings.csv).

- `dockerfile` and `backend/dockerfile` retain two HIGH missing-user findings. They are accepted as out of scope because deployment files must remain untouched.
- The MEDIUM XSS finding in the table-export code is a false positive. CSV cells are RFC 4180 quoted and the value is never sent to an HTML/DOM sink.
- Reliability remains clean.

---

## Phase 1 — Remaining HIGH duplication

Sources: [`Duplication findings.csv`](./sigrid-findings-1243/Duplication%20findings.csv) and [`Duplicates.csv`](./sigrid-findings-1243/Duplicates.csv).

HIGH duplication is down from 147 initially, to 119, and now to 91. Compared with the July 15 export, 66 IDs cleared, 38 appeared or were resegmented, and 53 were retained.

The remaining implementation order is:

1. Repeated flight-plan button definitions and identical plan/list cards.
2. Point and flight-plan field sequences that remain inside the same build context.
3. Flight-plan route query configurations and status-update route preparation.
4. Table headers/layout blocks and duplicate edit-point wrappers.
5. Remaining same-file export/report builders after a fresh scan.

Frontend/backend structural types remain accepted across build boundaries. No shared package is introduced during behavior-preserving remediation.

---

## Phase 2 — Unit size

Five HIGH unit-size findings remain:

- `nnederlandLayerSpecsPart1.ts`, `Part2.ts`, and `Part3.ts` are accepted declarative layer catalogues with McCabe 1.
- `voorbereidingTabs.ts` is accepted declarative tab data with McCabe 1.
- `backend/src/routes/auth2/mapLoginError.ts` was executable and is now addressed pending Sigrid confirmation. The public mapper is a short facade over response decision and diagnostic helpers, with status codes, event names, and authentication decisions preserved.

---

## Architecture remediation ledger

Sources: [`Module coupling findings.csv`](./sigrid-findings-1243/Module%20coupling%20findings.csv), [`Component independence findings.csv`](./sigrid-findings-1243/Component%20independence%20findings.csv), and [`Component entanglement findings.csv`](./sigrid-findings-1243/Component%20entanglement%20findings.csv).

The ledger key is `category + file/description + severity`. Because these exports do not provide stable IDs, every RAW row is covered by the addressed list or the deterministic acceptance rules below.

### Addressed pending Sigrid confirmation

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

All entries above stay `addressed pending confirmation` until a post-deployment Sigrid export proves that the original row cleared or resegmented.

### Accepted architecture findings

These acceptance rules cover every current architecture row not named in the addressed list:

- HIGH coupling in `useLogAction.ts` and `useContent.ts` is accepted. Both are cohesive application services with intentional high fan-in; splitting them would distribute coupling.
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

MEDIUM complexity fell from 46 to 40. Continue in descending executable complexity, beginning with form population, Excel export, import-column application, grant-error extraction, Timeslider detail orchestration, login parsing, geometry creation, selection sorting, image-query parsing, path drawing, and image handling.

The Excel export, import-column application, grant-error extraction, login parsing, geometry selection sorting, image-query parsing, plan filtering, center/zoom calculation, and plan-image rendering rows are addressed pending confirmation in the next export. Timeslider detail orchestration, form population, and geometry construction were already decomposed after the current export and also remain pending confirmation.

The two MEDIUM parameter-count rows from the current export are addressed pending confirmation:

- `finishedPlanHighlightActions.ts.draw(...)` now has four parameters inside a focused action factory.
- `geometryGraphicBuilders.ts.pointsToCoordinates(...)` now takes only points and an optional transform callback.

Use typed options objects only when this improves ownership and readability; preserve compatibility wrappers for exported helpers.

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
8. Keep every Sigrid export immutable and compare the next export with `sigrid-findings-1243` using [`compare-exports-pair.py`](./compare-exports-pair.py).

Current baseline limitations:

- The frontend production build requires unrestricted parent-directory access; it passes when run outside the restricted environment.
- Vitest is installed with a dedicated configuration and the frontend test suite passes.
- Standalone frontend `tsc --noEmit` is clean.

## Compatibility rules

- Existing public hook names, barrel imports, Zustand behavior, API routes, request/response shapes, authentication decisions, map symbols, cleanup ownership, UI labels, and export filenames remain unchanged.
- Old internal import paths remain short compatibility façades where repository-wide consumers still use them.
- No frontend/backend shared package, schema migration, deployment edit, commit, push, or branch operation is allowed.
