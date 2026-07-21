# Next focus status — Big Architecture wave (`20260721(1)`)

Dashboard baseline: Maintainability **4.2** · Architecture **3.3** (yellow) · OSH 4.7 · Security 4.3 · Reliability 5.5.

## Done this wave

### Wave A — Entanglement HIGH cycle break
- Moved `aandachtspuntDetailsValues` to [`src/helpers/points/aandachtspuntDetailsValues.ts`](../src/helpers/points/aandachtspuntDetailsValues.ts)
- Moved `FlightPlanFieldLabels` / `flightPlanStandardSelectProps` to [`src/hooks/flightPlan/flightPlanStandardSelectProps.ts`](../src/hooks/flightPlan/flightPlanStandardSelectProps.ts)
- Hooks no longer import `Components/HomePage/...`
- Added rule in [`scripts/check-architecture.mjs`](../scripts/check-architecture.mjs): hooks must not import HomePage

### Wave B — Accept ledger
- Recreated [`ACCEPT-LIST.md`](./ACCEPT-LIST.md) for Independence HIGH hubs, Core MEDIUM, Coupling, FE↔BE Dup, Docker

### Wave C — Maintainability
- Thinned `verifyCredentialsResponses` (≤30 LOC public units)
- Thinned TemplateFlight / FlightPlan Step2 Buttons via shared `wizardFilterStepSelection`
- Reinforced `csvExportCore` Semgrep-safe CSV builders

## Verification
- `npm run check:architecture`
- `npm run test:architecture-helpers`

## Manual before next export
1. Apply Accept list in Sigrid UI (Independence hubs + Docker + FE↔BE Dup)
2. Re-export — expect Entanglement HIGH cycle gone; Architecture may rise above 3.3
