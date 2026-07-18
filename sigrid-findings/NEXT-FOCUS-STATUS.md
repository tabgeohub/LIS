# Next Sigrid focus — status (Jul 18 pack)

Baseline: [`all-findings-rijkswaterstaat-otg-lis-20260718`](./all-findings-rijkswaterstaat-otg-lis-20260718/)

## Applied this wave

### Security
- CRITICAL SQLi already **FIXED** in Sigrid export; hardened remaining table-name SQL concat in [`regioPlanAssertions.ts`](../backend/scripts/regioPlanAssertions.ts) and [`entityDeleteHelpers.ts`](../backend/src/helpers/entities/entityDeleteHelpers.ts) (allowlisted literals only).
- HIGH Docker CWE-266 (**RAW**) — out of scope (no Dockerfile edits).
- HIGH deps: nodemailer already at 9.0.3; multer/undici current; Puppeteer already has external-request blocking in [`blockExternalPuppeteerRequests.ts`](../backend/src/routes/emails/blockExternalPuppeteerRequests.ts).
- MEDIUM CSV XSS finding — already mitigated via `escapeCsvCell` + nosemgrep note.

### Duplication
- ~**46** HIGH clone findings addressed across two batches (point column keys, flight-plan list handlers, SinglePlan twins, coord-sync clones, form field types, etc.).
- Cross-layer twins (keycloakUser FE↔BE) left (no shared package).

### Unit complexity
- All **19** MEDIUM complexity units thinned via branch helpers.

### Unit size / Independence / Coupling
- Unit size MEDIUM leftovers: Accept in Sigrid UI (`dockerfile`, `verify-regio-apis`).
- Independence/Coupling hubs (`useLogAction`, `useContent`, thin api-hooks): Accept intentional façades — no code churn.

## Verification
- `npm run check:architecture` — passed
- `npm run test:architecture-helpers` — passed
- `mapLoginError` tests — passed

## Expected next export
- Complexity MEDIUM → ~0
- Duplication HIGH → materially lower (~50 left if ~46 cleared; plus ~16 more residual polish)
- Interfacing MEDIUM → 0 (4 APIs collapsed to options objects)
- Security CRITICAL stays FIXED; RAW HIGH may remain Docker-only
- Maintainability stars: hold ≥4.0 / climb on duplication+complexity+interfacing volume drop

## Remaining-fixes wave (applied)

- Unit interfacing: 4 MEDIUM → options objects (`comparePointsWithSelectionOrder`, `drawFinishedPlanHighlight`, `toGeometryPointPayload`, `pointsToCoordinates`)
- Residual duplication: ~16 more within-layer twins
- Accept list documented: [`ACCEPT-LIST.md`](./ACCEPT-LIST.md) (Sigrid UI; hubs / Docker / Unit size leftovers)
