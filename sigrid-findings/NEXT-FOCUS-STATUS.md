# Next focus status — Sigrid-227 huge change wave

## Wave complete (local)

Sigrid-227 plan implemented: Architecture Accept ledger + major code unification + McCabe/interfacing polish. Behavior-preserving; no Docker/Nginx; no new `*Core` façade splits.

### Part 1 — Architecture Accept pass (UI)

- Rebased [`ACCEPT-LIST.md`](./ACCEPT-LIST.md) to export `sigrid-227`
- Added [`SIGRID-227-ACCEPT-CHECKLIST.md`](./SIGRID-227-ACCEPT-CHECKLIST.md) — **185** Accept rows (143 independence + 24 coupling + 5 entanglement + 2 security + 9 FE↔BE dup + 2 size)
- **Your action:** apply Accept in Sigrid UI using the checklist (primary lever for Architecture 3.3 → green)

### Part 2 — Dup + MEDIUM size unification

- `useWizardFilterStep2Buttons` — FlightPlan / TemplateFlight Step2 dup cleared
- `PlanInformationPanel` — Aandachtspunten + SelectedPoint twins unified
- `createDashboardSubmitHandlers` — EditUser / ResetPassword submit wiring deduped
- `useTimesliderItemImages` — shared enabled predicate; internal dup removed
- `appendFlightPlanWhereClause` — shared `FlightPlanWhereBase` + `resolveRegioColumn`

### Part 3 — McCabe 8 + MEDIUM interfacing

- `proxyShared.extractTargetUrlFromRequest` — resolver chain
- `featureLayerPopupResolve.resolveFeaturePopupData` — query path split
- `parseCsvImportRows` sibling — CSV buffer loop extracted from `parsePointImportFile`
- `respondToVerifyGrantFailure` — OTP vs password response builders
- `geometryHerhalen.compareGeometriesForSelection` — options context object (5 params → 3)

### Part 4 — Selective maintainability volume (~80 cap)

- Interfacing: 9 units → options objects (`runReturningUpdate`, `attemptPasswordGrant`, `loadPoints`/`loadGeometries`, report zip/attachment fetch, `useSyncEditUserForm`, etc.)
- McCabe 6: 10 units thinned (point graphics click, map hover, post proxy, drawing lifecycle, path click, geometries list, ViewPlan Step1/2, delete user, flight path metrics)
- Additional: `syncSelectedPlanPathLayer`, `nearestPoint`, legend sync effects, `drawTakenAtCaption` options object

## Verification

- `npm run check:architecture` — passed
- `npm run test:architecture-helpers` — passed

## Your next steps

1. Smoke-test: FlightPlan + TemplateFlight Step2 filter wizard, PlanInformation both paths, Dashboard edit/reset password, timeslider images, geometry herhalen sort, arcgis proxy, auth2 verify/login, ViewPlan Step1/2, PDF report attachments
2. Apply [`SIGRID-227-ACCEPT-CHECKLIST.md`](./SIGRID-227-ACCEPT-CHECKLIST.md) in Sigrid UI (~185 items)
3. Deploy → re-export Sigrid → confirm Architecture green and dup/size MEDIUM cleared

## Out of scope (unchanged)

- Architecture Independence MEDIUM Core re-splits
- Coupling fan-in rewrites (`useLogAction`, `useContent`)
- Docker CWE-266 / FE↔BE shared packages
- LOC ≤21 vanity (698 LOW size findings)

## Expected post-Accept + rescan

| Action | Findings cleared | Star impact |
| --- | --- | --- |
| Accept pass | ~185 | Architecture 3.3 → green (~4+) |
| Code wave (Parts 2–4) | ~25–40 maintainability | Maintainability hold ≥4.3 |
