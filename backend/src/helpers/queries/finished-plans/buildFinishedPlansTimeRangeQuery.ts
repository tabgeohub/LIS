import { FINISHED_PLANS_POINTS_CTE } from "../flight-plans/flightPlanJoin";
import {
  appendRegioFilter,
  RegioFilterOptions,
} from "../shared/regioFilter";

export function buildFinishedPlansTimeRangeQuery(
  regio_id: unknown,
  regioFilter: RegioFilterOptions = {
    caseInsensitiveAdmin: true,
    when: "provided",
  }
): { query: string; params: unknown[] } {
  const params: unknown[] = [];

  let query = `${FINISHED_PLANS_POINTS_CTE}
      SELECT
        MIN(fp.datum::date) AS "from",
        MAX(fp.datum::date) AS "to"
      FROM lis.flightplans fp
      JOIN points_per_plan ppp ON ppp.plan_id = fp.id
      JOIN lis.points pt ON pt.id = ppp.point_id
      WHERE fp.status = 'finished'
        AND fp.datum IS NOT NULL`;

  query = appendRegioFilter({
    sql: query,
    params,
    regio_id,
    column: "fp.regio_id",
    options: regioFilter,
  });

  return { query, params };
}
