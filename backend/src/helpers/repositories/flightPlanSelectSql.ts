import { buildFlightPlanSelectColumns } from "../queries/flight-plans/flightPlanColumns";
import { buildPointsUnnestJoin } from "./flightPlanJoinSql";
import {
  buildPointJsonObject,
  type PointJsonPreset,
} from "../queries/points/pointJson";
import type { FlightPlanColumnPreset } from "../queries/flight-plans/flightPlanColumns";

/** Canonical table names — keep SQL table literals in the repository layer. */
export const FLIGHT_PLANS_TABLE = "lis.flightPlans";
export const TEMPLATE_PLANS_TABLE = "lis.template_plans";

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
