import { buildFlightPlanSelectColumns } from "./flightPlanColumns";
import { buildPointsUnnestJoin } from "./flightPlanJoin";
import {
  appendRegioFilter,
  RegioFilterOptions,
  shouldFilterByRegio,
} from "./regioFilter";
import { buildPointJsonObject, PointJsonPreset } from "./pointJson";
import type { FlightPlanColumnPreset } from "./flightPlanColumns";

export type BuildFlightPlanQueryOptions = {
  planTable?: "lis.flightPlans" | "lis.template_plans";
  planAlias?: string;
  columnPreset: FlightPlanColumnPreset;
  pointPreset: PointJsonPreset;
  includeGeometryJoin?: boolean;
  where?: string;
  params?: unknown[];
  regio_id?: unknown;
  regioColumn?: string;
  regioFilter?: RegioFilterOptions;
  groupBy?: string;
  orderBy?: string;
};

export function buildFlightPlanQuery(
  options: BuildFlightPlanQueryOptions
): { query: string; params: unknown[] } {
  const {
    planTable = "lis.flightPlans",
    planAlias = planTable === "lis.template_plans" ? "tp" : "fp",
    columnPreset,
    pointPreset,
    includeGeometryJoin = false,
    where,
    params = [],
    regio_id,
    regioColumn,
    regioFilter = {
      when: "truthy",
      caseInsensitiveAdmin: true,
    },
    groupBy = `${planAlias}.id`,
    orderBy =
      columnPreset === "template"
        ? `${planAlias}.id`
        : `${planAlias}.created_at DESC`,
  } = options;

  const planColumns = buildFlightPlanSelectColumns(columnPreset, planAlias);
  const pointJson = buildPointJsonObject(pointPreset);
  const joins = buildPointsUnnestJoin(planAlias, includeGeometryJoin);

  let query = `
      SELECT
        ${planColumns}
        JSON_AGG(
          ${pointJson}
        ) AS points
      FROM ${planTable} ${planAlias}
      ${joins}`;

  if (where) {
    query += `
      WHERE ${where}`;
    if (regio_id !== undefined) {
      query = appendRegioFilter(
        query,
        params,
        regio_id,
        regioColumn ?? `${planAlias}.regio_id`,
        regioFilter
      );
    }
  } else if (
    regio_id !== undefined &&
    shouldFilterByRegio(regio_id, regioFilter)
  ) {
    params.push(regio_id);
    query += `
      WHERE ${regioColumn ?? `${planAlias}.regio_id`} = $${params.length}`;
  }

  query += `
      GROUP BY ${groupBy}
      ORDER BY ${orderBy}`;

  return { query, params };
}
