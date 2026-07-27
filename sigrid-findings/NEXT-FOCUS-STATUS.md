# Next focus status — Sigrid 20260727 huge wave (no Docker / Nginx)

## Wave complete (local)

Full-pack remediation against `all-findings-rijkswaterstaat-otg-lis-20260727`. Behavior-preserving; **no Dockerfile / Nginx edits**.

### Part 1 — Dup HIGH → 0 (code)

- `useWizardFilterStep2Buttons` now takes `store` + `mapView` (selection built inside) — Step2 FlightPlan/TemplateFlight clone cleared
- BE [`devices-updates/types.ts`](../backend/src/routes/devices-updates/types.ts) no longer re-exports shared device types (only `AgentReportBody`); callers import from `backend/src/shared/devices`

### Part 2 — Security / OSH

- `react-router-dom` bumped to **6.30.4** (CWE-601 / CVE-2026-53668)
- Docker CWE-266 + CWE-250 → **Accept only** (no Dockerfile edits)

### Part 3 — Accept ledger

- [`ACCEPT-LIST.md`](./ACCEPT-LIST.md) rebased to full 20260727 pack
- [`SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md`](./SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md) — **178** items (143 indep + 24 coupling + 5 entanglement + 4 Docker security + 2 size)
- Generator: `tools/gen-sigrid-20260727-full-accept-checklist.mjs`

### Part 4 — Maintainability volume

- McCabe 7 cluster thinned (`App` bootstrap helper, grantError, parseCsv, geometryHerhalen, query defaults, attachments, spoed validate, logEntry, template geometry)
- ~20+ non-Express 3-param units → options objects (map layers, arcgis post, image gallery, legend sync, CSV accumulate, herhalen filters, wizard log step, etc.)

## Verification

- `npm run check:architecture` — passed
- `npm run test:architecture-helpers` — passed
- `backend npm run build` — passed
- `npx vitest run` — 15 files / 39 tests passed

## Your next steps

1. Apply [`SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md`](./SIGRID-20260727-FULL-ACCEPT-CHECKLIST.md) in Sigrid UI (~178 items) — primary Architecture lever
2. Deploy this wave
3. Rescan + export — expect Dup HIGH **0**, McCabe/interfacing polish, `react-router-dom` FIXED, Architecture toward green after Accept

## Out of scope (unchanged)

- Dockerfile / Nginx edits
- Independence MEDIUM Core re-splits
- Coupling fan-in rewrites (`useLogAction`, `useContent`)
- LOC ≤21 vanity (698 LOW size)
