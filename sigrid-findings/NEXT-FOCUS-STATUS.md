# NEXT-FOCUS-STATUS — Data coupling leftovers after 3.9

## Baseline (post-3.9 export)

- Architecture **3.9**, Data coupling still **1.46**
- Hot CC: flightplans 4, geometries/points 3, finished_plans/template_plans/users 2

## Code fixes (this wave + arch wave 2)

Already on main from wave 2: CSV hotspot files no longer embed SQL (repos only).

**Additional concentration now:**
- Scripts `verifyRegioPointsGeometries` / `regioPlanAssertions` call repos (no embedded SQL)
- `buildFlightPlanSelectBody` + `FLIGHT_PLANS_TABLE` / `TEMPLATE_PLANS_TABLE` in `flightPlanSelectSql.ts`
- `entityExists("points"|"geometries")` — no `lis.*` table-name literals in routes/helpers

## Left intentionally (CC already 1)

- `routes/emails/*`, `routes/devices-updates/*`, `lis.logging` helpers

## After next Sigrid scan

Re-export architecture-data-* CSVs. Expect Connected components for hotspot entities ≤2 (ideally 1 for secondaries).
