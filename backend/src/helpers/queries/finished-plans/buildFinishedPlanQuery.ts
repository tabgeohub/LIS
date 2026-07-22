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
export { buildFinishedPlansTimeRangeQuery } from "./buildFinishedPlansTimeRangeQuery";
export {
  buildFinishedPlanRegioWhereClause,
  type FinishedPlanRegioWhereInput,
} from "./buildFinishedPlanRegioWhereClause";

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

  const whereClause = appendFinishedDateRange({
    whereClause: "WHERE fp.status = 'finished'",
    params,
    dateRange,
  });
  const query = appendFinishedRegioAndOrder({
    query: buildFinishedPlansSelectBody(whereClause),
    params,
    regio_id,
    regioFilter,
    orderBy,
  });

  return { query, params };
}
