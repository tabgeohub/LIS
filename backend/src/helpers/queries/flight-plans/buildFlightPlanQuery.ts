import {
  appendFlightPlanWhereClause,
  buildFlightPlanSelectBody,
  resolveFlightPlanQueryDefaults,
  type BuildFlightPlanQueryOptions,
} from "./buildFlightPlanQueryParts";

export type { BuildFlightPlanQueryOptions } from "./buildFlightPlanQueryParts";

export function buildFlightPlanQuery(
  options: BuildFlightPlanQueryOptions
): { query: string; params: unknown[] } {
  const resolved = resolveFlightPlanQueryDefaults(options);

  let query = buildFlightPlanSelectBody({
    planAlias: resolved.planAlias,
    columnPreset: resolved.columnPreset,
    pointPreset: resolved.pointPreset,
    includeGeometryJoin: resolved.includeGeometryJoin,
    planTable: resolved.planTable,
  });

  query = appendFlightPlanWhereClause({
    query,
    params: resolved.params,
    where: resolved.where,
    regio_id: resolved.regio_id,
    regioColumn: resolved.regioColumn,
    regioFilter: resolved.regioFilter,
    planAlias: resolved.planAlias,
  });

  query += `
      GROUP BY ${resolved.groupBy}
      ORDER BY ${resolved.orderBy}`;

  return { query, params: resolved.params };
}
