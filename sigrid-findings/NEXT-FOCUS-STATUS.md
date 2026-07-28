# NEXT-FOCUS-STATUS — Data coupling repositories wave

## Done (this wave)

Concentrated embedded SQL for **points**, **flightplans**, **attachments**, **finished_plans** (+ path) into:

`backend/src/helpers/repositories/`

- `queryable.ts`
- `pointsRepo.ts`
- `flightPlansRepo.ts`
- `attachmentsRepo.ts`
- `finishedPlansRepo.ts`
- `finishedPlansPathRepo.ts`

Routes and cascades now call repos (no table SQL left in those orchestrators for the four entities). Writers (`createFinishedPlanDb`, import, attachment update/fetch) go through repos.

## Still expected SQL edges (phase-2 candidates)

Multi-table join/CTE composers still embed table names by design:

- `helpers/queries/finished-plans/*` list/single CTE builders
- `helpers/queries/flight-plans/flightPlanJoin.ts`
- `helpers/queries/points/pointJson.ts`
- `helpers/queries/timeslider/timesliderPlanImagesQuery.ts`

## Architecture Accept (still your UI action)

Independence / Coupling / Entanglement Accept checklists remain the fast path for Architecture **findings**. Data coupling **0.5** should improve after the next Sigrid upload measuring this repo layer.

## Verify after upload

Re-export Data coupling CSVs; expect fewer connected components on points / flightplans / attachments / finished_plans.
