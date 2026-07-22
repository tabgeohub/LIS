# Next focus status — Next Maintainability findings wave (`20260721(1)`)

## Wave complete (local)

Follow-up Maintainability wave after the volume pass. Behavior-preserving; no Docker/Nginx; no new Architecture `*Core` façades.

### Batch 1 — Residual McCabe ≥7
- Further thinned geometry formatters, proxy URL helpers, auth2/keycloak paths where still complex
- Template `Fase3` map-preview extract; many prior-wave targets already simple on disk

### Batch 2 — McCabe == 6 clusters
- `resolveRegioFilter` / regio role predicates
- `usePointGraphicsEffects` branch extracts
- `pdfReportTables` cell helpers + options objects
- Hover/path/auth/drawing clusters continued where still open

### Batch 3 — Residual interfacing
- Legend layout helpers → options objects
- `respondVerifyError`, `assertKeycloakResponseOk`, `buildNormalizedFields`, `appendFinishedDateRange`, `respondImportSuccess`
- `patchPlanWithUpdatedPoint`, `isNearExistingPoint`, `commitFotoAttachmentDelete`
- PDF table APIs updated to options; call sites updated

### Batch 4 — Size LOC ≥25 / selective 22–24
- Prior size-agent splits (auth2 barrels, EditPointCoordinates, hover siblings, Step2 wizard selection) kept
- `FlightPlanPickerList` → `FlightPlanPickerRow` sibling
- `formatFinishedPlansWithGeometries` helper extracts
- LOC 16–19 vanity left for later

## Verification

- `npm run check:architecture` — passed
- `npm run test:architecture-helpers` — passed

## Your next steps

1. Smoke-test: auth2 verify/login, CreateReport PDF, Legend nesting, Foto delete, EditPoint coords, add-point near-check, template Fase3, finished-plan queries
2. Deploy → re-export Sigrid
3. Apply [`ACCEPT-LIST.md`](./ACCEPT-LIST.md) in Sigrid UI
4. Remaining volume after this: mostly LOC ≤21 vanity + Accept-only Architecture

## Out of scope (unchanged)

- Architecture Independence MEDIUM Core re-splits
- Coupling fan-in rewrites
- Docker CWE-266 / FE↔BE shared packages
