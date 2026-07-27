# Next focus status — Coupling Accept + complexity/interfacing clear

## Wave complete (local)

Exports addressed:
- [`module-coupling-findings-rijkswaterstaat-otg-lis-20260727(1).csv`](./module-coupling-findings-rijkswaterstaat-otg-lis-20260727(1).csv) — **Accept** (24)
- [`unit-complexity-findings-rijkswaterstaat-otg-lis-20260727.csv`](./unit-complexity-findings-rijkswaterstaat-otg-lis-20260727.csv) — **code** (83 McCabe-6)
- [`unit-interfacing-findings-rijkswaterstaat-otg-lis-20260727.csv`](./unit-interfacing-findings-rijkswaterstaat-otg-lis-20260727.csv) — **code** (~30 options-object) + Accept Express/Multer signatures

### Coupling — Accept only

Checklist: [`SIGRID-COUPLING-ACCEPT-CHECKLIST.md`](./SIGRID-COUPLING-ACCEPT-CHECKLIST.md)  
Includes HIGH `useLogAction` / `useContent` and all MEDIUM/LOW hubs. No hub rewrites.

### Complexity — McCabe 6 thinned

Batches A/B/C: helper extracts + early returns across ~80 units (deleteUser, map hover/click, centroid, auth2, timeslider, PDF tables, regio filter, arcgis proxy, etc.).

### Interfacing — options objects

Non-Express units collapsed to `input: { ... }` (bounding box, map source items, wizard cleanup, grantError, flightPlanExtraColumns, attachments helpers, etc.).  
**Left as framework signatures (Accept):** Express `RequestHandler`, Multer `fileFilter`/`filename`.

## Verification

- `npm run check:architecture` — passed
- `npm run test:architecture-helpers` — passed
- `backend npm run build` — passed
- `npx vitest run` — 15 files / 39 tests passed

## Your next steps

1. Accept [`SIGRID-COUPLING-ACCEPT-CHECKLIST.md`](./SIGRID-COUPLING-ACCEPT-CHECKLIST.md) (+ Express/Multer interfacing rows listed there) in Sigrid UI
2. Deploy → rescan → expect complexity/interfacing RAW drop; coupling cleared by Accept

## Constraints held

- No Dockerfile / Nginx edits
- No `useLogAction` / `useContent` rewrites
- No new Independence `*Core` façades
