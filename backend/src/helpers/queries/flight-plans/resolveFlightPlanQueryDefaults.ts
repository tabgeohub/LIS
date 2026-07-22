import type { FlightPlanColumnPreset } from "./flightPlanColumns";
import type { PointJsonPreset } from "../points/pointJson";
import type { RegioFilterOptions } from "../shared/regioFilter";

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

function defaultPlanAlias(
  planTable: string,
  planAlias?: string
): string {
  if (planAlias) return planAlias;
  return planTable === "lis.template_plans" ? "tp" : "fp";
}

function defaultRegioFilter(
  regioFilter?: RegioFilterOptions
): RegioFilterOptions {
  return (
    regioFilter ?? {
      when: "truthy" as const,
      caseInsensitiveAdmin: true,
    }
  );
}

function defaultOrderBy(
  planAlias: string,
  columnPreset: FlightPlanColumnPreset,
  orderBy?: string
): string {
  if (orderBy) return orderBy;
  return columnPreset === "template"
    ? `${planAlias}.id`
    : `${planAlias}.created_at DESC`;
}

function resolveFlightPlanQueryScalars(
  options: BuildFlightPlanQueryOptions,
  planAlias: string
) {
  return {
    includeGeometryJoin: options.includeGeometryJoin ?? false,
    where: options.where,
    params: options.params ?? [],
    regio_id: options.regio_id,
    regioColumn: options.regioColumn,
    regioFilter: defaultRegioFilter(options.regioFilter),
    groupBy: options.groupBy ?? `${planAlias}.id`,
    orderBy: defaultOrderBy(
      planAlias,
      options.columnPreset,
      options.orderBy
    ),
  };
}

export function resolveFlightPlanQueryDefaults(
  options: BuildFlightPlanQueryOptions
) {
  const planTable = options.planTable ?? "lis.flightPlans";
  const planAlias = defaultPlanAlias(planTable, options.planAlias);

  return {
    planTable,
    planAlias,
    columnPreset: options.columnPreset,
    pointPreset: options.pointPreset,
    ...resolveFlightPlanQueryScalars(options, planAlias),
  };
}
