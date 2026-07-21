# Next focus status — Big Architecture wave + extra pre-deploy polish (`20260721(1)`)

Dashboard baseline: Maintainability **4.2** · Architecture **3.3** (yellow) · OSH 4.7 · Security 4.3 · Reliability 5.5.

## Done — plan waves

### Wave A — Entanglement HIGH cycle break
- Moved shared types out of Components (`aandachtspuntDetailsValues`, flight-plan select props)
- Hooks no longer import `Components/HomePage`
- Architecture rule enforced in `scripts/check-architecture.mjs`

### Wave B — Accept ledger
- [`ACCEPT-LIST.md`](./ACCEPT-LIST.md) for Independence hubs, Core MEDIUM, Coupling, FE↔BE Dup, Docker

### Wave C — Maintainability
- Unit size thins (auth2 verify responses, Step2 Buttons)
- Same-component Dup polish
- csvExportCore Semgrep reinforcement

## Extra pre-deploy polish (this session)

- Split `showPlanSearchListHoverCore` into body / hover-from-map / clear siblings (fat Independence HIGH removed)
- Thinned `useDeletePointState` → façade + Core/types/form-field siblings
- Thinned `FlightPlanStandardFields` → View sibling
- Thinned `usePlanPointAttachments`
- TemplateFlight Step2/Step3 shared cleanup; AddToPlan shared step-buttons hook

## Verification
- `npm run check:architecture` — pass
- `npm run test:architecture-helpers` — pass

## Before next deploy / Sigrid export
1. Apply Accept list in Sigrid UI
2. Smoke-test: drawing store forms, flight-plan forms, plan hover table/list, delete-point wizard, CSV export
3. Re-export — expect Entanglement HIGH cycle gone; Independence HIGH `showPlanSearchListHoverCore` gone
