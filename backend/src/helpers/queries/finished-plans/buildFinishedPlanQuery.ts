import { FINISHED_PLANS_POINTS_CTE } from "../flight-plans/flightPlanJoin";
import {
  appendRegioFilter,
  buildRegioWhereClause,
  RegioFilterOptions,
} from "../shared/regioFilter";
import {
  appendFinishedDateRange,
  appendFinishedRegioAndOrder,
  buildFinishedPlansSelectBody,
  DEFAULT_FINISHED_REGIO_FILTER,
  type BuildFinishedPlansQueryOptions,
} from "./buildFinishedPlansWithPointsHelpers";

export type { BuildFinishedPlansQueryOptions };
export { buildFinishedFlightPlansListQuery } from "./buildFinishedFlightPlansListQuery";
export { buildSingleFinishedFlightPlanQuery } from "./buildSingleFinishedFlightPlanQuery";

export function buildFinishedPlansWithPointsQuery(
  options: BuildFinishedPlansQueryOptions = {}
): { query: string; params: unknown[] } {
  const {
    params = [],
    regio_id,
    regioFilter = DEFAULT_FINISHED_REGIO_FILTER,
    dateRange,
    orderBy,
  } = options;

  const whereClause = appendFinishedDateRange(
    "WHERE fp.status = 'finished'",
    params,
    dateRange
  );
  const query = appendFinishedRegioAndOrder({
    query: buildFinishedPlansSelectBody(whereClause),
    params,
    regio_id,
    regioFilter,
    orderBy,
  });

  return { query, params };
}

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

export type FinishedPlanRegioWhereInput = {
  regio_id: unknown;
  params: unknown[];
  column: string;
  regioFilter?: RegioFilterOptions;
};

export function buildFinishedPlanRegioWhereClause(
  input: FinishedPlanRegioWhereInput
): string {
  const {
    regio_id,
    params,
    column,
    regioFilter = {
      caseInsensitiveAdmin: true,
      when: "provided",
      castAsText: true,
    },
  } = input;

  return buildRegioWhereClause({
    regio_id,
    params,
    column,
    options: regioFilter,
    prefix: "AND",
  });
}
