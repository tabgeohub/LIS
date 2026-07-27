# Next focus status — Sigrid 20260727 duplication clear + Accept

## Wave complete (local)

Duplication HIGH cleared by a real shared FE/BE source under `backend/src/shared/`. Independence + coupling remain **Accept-only**.

### Code — Duplication (10 → expect 0)

- `backend/src/shared/` modules: `keycloakUser`, `devices`, `installer`, `pointCoreKeys`, `flightPlanFields`, `geometryFormFields`
- Vite / tsconfig / vitest aliases for `shared/*`
- FE + BE twins re-export / import shared (no call-site churn)
- `PointDetailsFieldsList` derives identity keys from shared
- `buildWizardStep2Selection` — FlightPlan / TemplateFlight Step2 clone broken
- Deleted dead CRA [`public/index.html`](../public/index.html)

### Accept — Independence + Coupling (167)

- [`ACCEPT-LIST.md`](./ACCEPT-LIST.md) rebased to 20260727
- [`SIGRID-20260727-ACCEPT-CHECKLIST.md`](./SIGRID-20260727-ACCEPT-CHECKLIST.md) — **167** items
- Generator: `tools/gen-sigrid-20260727-accept-checklist.mjs`

## Verification

- `npm run check:architecture` — passed
- `npm run test:architecture-helpers` — passed
- `backend npm run build` — passed
- `npx vitest run` — 15 files / 39 tests passed
- Frontend `tsc --noEmit` still reports pre-existing unrelated errors (none on `shared/`)

## Your next steps

1. Apply [`SIGRID-20260727-ACCEPT-CHECKLIST.md`](./SIGRID-20260727-ACCEPT-CHECKLIST.md) in Sigrid UI (167 items)
2. Deploy → rescan → export fresh findings
3. Confirm Dup HIGH = 0; Architecture should move green after Accept

## Risk watch

Frontend importing `backend/src/shared/` may add FE→backend graph edges. If new coupling/entanglement appears, fallback is root-level `shared/` + a `backend/dockerfile` `COPY shared` line.

## Out of scope

- Independence MEDIUM Core re-splits
- Coupling fan-in rewrites (`useLogAction`, `useContent`)
- Docker CWE-266
