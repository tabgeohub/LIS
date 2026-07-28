import type { FlightPlanColumnPreset } from "./flightPlanColumns";
import type { PointJsonPreset } from "../points/pointJson";
import type { RegioFilterOptions } from "../shared/regioFilter";
import {
  FLIGHT_PLANS_TABLE,
  TEMPLATE_PLANS_TABLE,
} from "../../repositories/flightPlanSelectSql";

export type FlightPlanTable =
  | typeof FLIGHT_PLANS_TABLE
  | typeof TEMPLATE_PLANS_TABLE;

export type BuildFlightPlanQueryOptions = {
  planTable?: FlightPlanTable;
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

function withDefault<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

function defaultPlanAlias(
  planTable: string,
  planAlias?: string
): string {
  if (planAlias) return planAlias;
  return planTable === TEMPLATE_PLANS_TABLE ? "tp" : "fp";
}

function defaultRegioFilter(
  regioFilter?: RegioFilterOptions
): RegioFilterOptions {
  return withDefault(regioFilter, {
    when: "truthy" as const,
    caseInsensitiveAdmin: true,
  });
}

function defaultOrderBy(input: {
  planAlias: string;
  columnPreset: FlightPlanColumnPreset;
  orderBy?: string;
}): string {
  if (input.orderBy) return input.orderBy;
  return input.columnPreset === "template"
    ? `${input.planAlias}.id`
    : `${input.planAlias}.created_at DESC`;
}

function resolveFlightPlanQueryScalars(
  options: BuildFlightPlanQueryOptions,
  planAlias: string
) {
  return {
    includeGeometryJoin: withDefault(options.includeGeometryJoin, false),
    where: options.where,
    params: withDefault(options.params, [] as unknown[]),
    regio_id: options.regio_id,
    regioColumn: options.regioColumn,
    regioFilter: defaultRegioFilter(options.regioFilter),
    groupBy: withDefault(options.groupBy, `${planAlias}.id`),
    orderBy: defaultOrderBy({
      planAlias,
      columnPreset: options.columnPreset,
      orderBy: options.orderBy,
    }),
  };
}

export function resolveFlightPlanQueryDefaults(
  options: BuildFlightPlanQueryOptions
) {
  const planTable = withDefault(options.planTable, FLIGHT_PLANS_TABLE);
  const planAlias = defaultPlanAlias(planTable, options.planAlias);

  return {
    planTable,
    planAlias,
    columnPreset: options.columnPreset,
    pointPreset: options.pointPreset,
    ...resolveFlightPlanQueryScalars(options, planAlias),
  };
}
