import { FINISHED_PLANS_POINTS_CTE } from "../flight-plans/flightPlanJoin";
import { buildFinishedPlanPointJsonbObject } from "../points/pointJson";
import {
  appendRegioFilter,
  type RegioFilterOptions,
} from "../shared/regioFilter";

export const DEFAULT_FINISHED_REGIO_FILTER: RegioFilterOptions = {
  caseInsensitiveAdmin: true,
  when: "truthy",
};

export type BuildFinishedPlansQueryOptions = {
  params?: unknown[];
  regio_id?: unknown;
  regioFilter?: RegioFilterOptions;
  dateRange?: { from: string; to: string };
  orderBy?: string;
};

export function appendFinishedDateRange(input: {
  whereClause: string;
  params: unknown[];
  dateRange?: { from: string; to: string };
}): string {
  if (!input.dateRange) {
    return input.whereClause;
  }
  input.params.push(input.dateRange.from, input.dateRange.to);
  return `${input.whereClause}
        AND fp.datum IS NOT NULL
        AND fp.datum::date >= $1::date
        AND fp.datum::date <= $2::date`;
}

export function buildFinishedPlansSelectBody(whereClause: string): string {
  const pointJson = buildFinishedPlanPointJsonbObject();
  return `${FINISHED_PLANS_POINTS_CTE}
      SELECT
        fp.*,
        jsonb_agg(
          jsonb_strip_nulls(
            ${pointJson}
          )
          ORDER BY pt.created_at, pt.id
        ) AS points_data
      FROM lis.flightplans fp
      JOIN points_per_plan ppp ON ppp.plan_id = fp.id
      JOIN lis.points pt ON pt.id = ppp.point_id
      LEFT JOIN lis.geometries g ON g.id = pt.geometry_id
      ${whereClause}`;
}

export function appendFinishedRegioAndOrder(input: {
  query: string;
  params: unknown[];
  regio_id: unknown;
  regioFilter: RegioFilterOptions;
  orderBy?: string;
}): string {
  let query = input.query;
  if (input.regio_id !== undefined) {
    query = appendRegioFilter({
      sql: query,
      params: input.params,
      regio_id: input.regio_id,
      column: "fp.regio_id",
      options: input.regioFilter,
    });
  }
  query += `
      GROUP BY fp.id`;
  if (input.orderBy) {
    query += `
      ORDER BY ${input.orderBy}`;
  }
  return query;
}
