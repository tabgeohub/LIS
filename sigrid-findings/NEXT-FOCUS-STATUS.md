# NEXT-FOCUS-STATUS — Architecture Data coupling phase 2

## Scores (baseline pack 20260728)

| Metric | Score | Note |
| --- | --- | --- |
| Architecture | **3.6** (green) | Target: greener via Data coupling |
| Data coupling | **~1.46** | Phase 2 code complete; await rescan |
| Maintainability | **4.4** | Untouched this wave |

## Connected components — expected after rescan

| Entity | Before | Target |
| --- | --- | --- |
| `flightplans` | 4 | ≤2 |
| `geometries` | 3 | ≤2 |
| `points` | 3 | ≤2 |
| `finished_plans` | 2 | 1 |
| `template_plans` | 2 | 1 |
| `users` | 2 | 1 |
| `attachments` / emails / getac | 1 | keep |

## Done (code)

### Wave A
- `flightPlansRepo`: INSERT/UPDATE SQL + `selectPreparedFlightPlanIdsWithRegio`; script uses repo
- `finishedPlansTimesliderQuery.ts`: timeslider JOIN SQL
- **New** `geometriesRepo.ts`: exists/select/insert/update/delete
- `pointsRepo`: `insertPointReturningRow` / `updatePointByIdReturning`; route raw SQL removed

### Wave B
- `finishedPlansQuerySql.ts` + `flightPlansByPointQuery.ts` + `flightPlanJoinSql.ts`: CTE/list/join SQL under repositories
- **New** `templatePlansRepo.ts`, `usersRepo.ts`

## Your action

1. Accept Architecture Independence/coupling/entanglement in Sigrid UI ([ACCEPT-LIST.md](ACCEPT-LIST.md))
2. Push + wait for Sigrid rescan; compare data-store-entities Connected components

## Out of scope

- Dockerfile / Nginx
- Independence `*Core` / hub rewrites
- emails / getac_devices (already CC=1)
- Pulling `backend/scripts` into repos
