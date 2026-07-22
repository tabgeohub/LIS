import { buildFlightPlanSelectColumns } from "./flightPlanColumns";
import { buildPointsUnnestJoin } from "./flightPlanJoin";
import { buildPointJsonObject, PointJsonPreset } from "../points/pointJson";
import type { FlightPlanColumnPreset } from "./flightPlanColumns";

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
