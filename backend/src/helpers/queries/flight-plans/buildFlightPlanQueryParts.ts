import { buildFlightPlanSelectColumns } from "./flightPlanColumns";
import { buildPointsUnnestJoin } from "./flightPlanJoin";
import {
  appendRegioFilter,
  RegioFilterOptions,
  shouldFilterByRegio,
} from "../shared/regioFilter";
import { buildPointJsonObject, PointJsonPreset } from "../points/pointJson";
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

export function resolveFlightPlanQueryDefaults(
  options: BuildFlightPlanQueryOptions
) {
  const planTable = options.planTable ?? "lis.flightPlans";
  const planAlias =
    options.planAlias ??
    (planTable === "lis.template_plans" ? "tp" : "fp");

  return {
    planTable,
    planAlias,
    columnPreset: options.columnPreset,
    pointPreset: options.pointPreset,
    includeGeometryJoin: options.includeGeometryJoin ?? false,
    where: options.where,
    params: options.params ?? [],
    regio_id: options.regio_id,
    regioColumn: options.regioColumn,
    regioFilter: options.regioFilter ?? {
      when: "truthy" as const,
      caseInsensitiveAdmin: true,
    },
    groupBy: options.groupBy ?? `${planAlias}.id`,
    orderBy:
      options.orderBy ??
      (options.columnPreset === "template"
        ? `${planAlias}.id`
        : `${planAlias}.created_at DESC`),
  };
}

export function appendFlightPlanWhereClause(input: {
  query: string;
  params: unknown[];
  where?: string;
  regio_id?: unknown;
  regioColumn?: string;
  regioFilter: RegioFilterOptions;
  planAlias: string;
}): string {
  let query = input.query;

  if (input.where) {
    query += `
      WHERE ${input.where}`;
    if (input.regio_id !== undefined) {
      query = appendRegioFilter({
        sql: query,
        params: input.params,
        regio_id: input.regio_id,
        column: input.regioColumn ?? `${input.planAlias}.regio_id`,
        options: input.regioFilter,
      });
    }
    return query;
  }

  if (
    input.regio_id !== undefined &&
    shouldFilterByRegio(input.regio_id, input.regioFilter)
  ) {
    input.params.push(input.regio_id);
    query += `
      WHERE ${input.regioColumn ?? `${input.planAlias}.regio_id`} = $${input.params.length}`;
  }

  return query;
}

export function buildFlightPlanSelectBody(input: {
  planAlias: string;
  columnPreset: FlightPlanColumnPreset;
  pointPreset: PointJsonPreset;
  includeGeometryJoin: boolean;
  planTable: string;
}) {
  const planColumns = buildFlightPlanSelectColumns({
    preset: input.columnPreset,
    planAlias: input.planAlias,
  });
  const pointJson = buildPointJsonObject(input.pointPreset);
  const joins = buildPointsUnnestJoin(
    input.planAlias,
    input.includeGeometryJoin
  );

  return `
      SELECT
        ${planColumns}
        JSON_AGG(
          ${pointJson}
        ) AS points
      FROM ${input.planTable} ${input.planAlias}
      ${joins}`;
}
