import type { FlightPlanColumnPreset } from "./flightPlanColumnTypes";
import { flightPlanExtraColumns } from "./flightPlanExtraColumns";

const FLIGHT_PLAN_STANDARD_EXTRA = [
  "vliegduur",
  "luchtvaartuig",
  "passagiers",
  "hoofdthema",
  "aanvullende",
  "piloot",
  "waarnemer",
] as const;

const FLIGHT_PLAN_ALL_EXTRA = [
  "vliegduur",
  "luchtvaartuig",
  "passagiers",
  "hoofdthema",
  "regio_id",
  "aanvullende",
  "piloot",
  "waarnemer",
] as const;

export function resolveFlightPlanColumnPreset(
  preset: FlightPlanColumnPreset,
  planAlias: string
): string {
  const base = `${planAlias}.id AS id, ${planAlias}.vluchtnummer, ${planAlias}.omschrijving, ${planAlias}.datum, ${planAlias}.user_id, ${planAlias}.status, ${planAlias}.basemap, ${planAlias}.created_at`;
  const standardExtra = `${base},\n        ${flightPlanExtraColumns({ planAlias, columns: FLIGHT_PLAN_STANDARD_EXTRA })},`;
  const presets: Record<FlightPlanColumnPreset, string> = {
    all: `${base},\n        ${flightPlanExtraColumns({ planAlias, columns: FLIGHT_PLAN_ALL_EXTRA })},`,
    search: standardExtra,
    prepared: standardExtra,
    minimal: `${base},`,
    byId: `${standardExtra}
        ${planAlias}.layers,`,
    template: `${planAlias}.id AS id,
        ${planAlias}.name,`,
  };
  return presets[preset];
}
