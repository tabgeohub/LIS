export type FlightPlanColumnPreset =
  | "all"
  | "search"
  | "prepared"
  | "minimal"
  | "byId"
  | "template";

export function buildFlightPlanSelectColumns(
  preset: FlightPlanColumnPreset,
  planAlias: string,
  extraSelect?: string
): string {
  const base = `${planAlias}.id AS id, ${planAlias}.vluchtnummer, ${planAlias}.omschrijving, ${planAlias}.datum, ${planAlias}.user_id, ${planAlias}.status, ${planAlias}.basemap, ${planAlias}.created_at`;

  const presets: Record<FlightPlanColumnPreset, string> = {
    all: `${base},
        ${planAlias}.vliegduur,
        ${planAlias}.luchtvaartuig,
        ${planAlias}.passagiers,
        ${planAlias}.hoofdthema,
        ${planAlias}.regio_id,
        ${planAlias}.aanvullende,
        ${planAlias}.piloot,
        ${planAlias}.waarnemer,`,
    search: `${base},
        ${planAlias}.vliegduur,
        ${planAlias}.luchtvaartuig,
        ${planAlias}.passagiers,
        ${planAlias}.hoofdthema,
        ${planAlias}.aanvullende,
        ${planAlias}.piloot,
        ${planAlias}.waarnemer,`,
    prepared: `${base},
        ${planAlias}.vliegduur,
        ${planAlias}.luchtvaartuig,
        ${planAlias}.passagiers,
        ${planAlias}.hoofdthema,
        ${planAlias}.aanvullende,
        ${planAlias}.piloot,
        ${planAlias}.waarnemer,`,
    minimal: `${base},`,
    byId: `${base},
        ${planAlias}.vliegduur,
        ${planAlias}.luchtvaartuig,
        ${planAlias}.passagiers,
        ${planAlias}.hoofdthema,
        ${planAlias}.aanvullende,
        ${planAlias}.piloot,
        ${planAlias}.waarnemer,
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
