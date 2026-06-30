export type FlightPlanColumnPreset =
  | "all"
  | "search"
  | "prepared"
  | "minimal"
  | "byId"
  | "template";

const FLIGHT_PLAN_STANDARD_EXTRA = [
  "vliegduur",
  "luchtvaartuig",
  "passagiers",
  "hoofdthema",
  "aanvullende",
  "piloot",
  "waarnemer",
] as const;

function flightPlanExtraColumns(
  planAlias: string,
  columns: readonly string[]
): string {
  return columns.map((column) => `${planAlias}.${column}`).join(",\n        ");
}

export function buildFlightPlanSelectColumns(
  preset: FlightPlanColumnPreset,
  planAlias: string,
  extraSelect?: string
): string {
  const base = `${planAlias}.id AS id, ${planAlias}.vluchtnummer, ${planAlias}.omschrijving, ${planAlias}.datum, ${planAlias}.user_id, ${planAlias}.status, ${planAlias}.basemap, ${planAlias}.created_at`;
  const standardExtra = `${base},\n        ${flightPlanExtraColumns(planAlias, FLIGHT_PLAN_STANDARD_EXTRA)},`;
  const allExtra = `${base},\n        ${flightPlanExtraColumns(planAlias, [
    "vliegduur",
    "luchtvaartuig",
    "passagiers",
    "hoofdthema",
    "regio_id",
    "aanvullende",
    "piloot",
    "waarnemer",
  ])},`;

  const presets: Record<FlightPlanColumnPreset, string> = {
    all: allExtra,
    search: standardExtra,
    prepared: standardExtra,
    minimal: `${base},`,
    byId: `${standardExtra}
        ${planAlias}.layers,`,
    template: `${planAlias}.id AS id,
        ${planAlias}.name,`,
  };

  const columns = presets[preset];

  if (!extraSelect) {
    return columns;
  }

  return `${columns}
        ${extraSelect},`;
}
