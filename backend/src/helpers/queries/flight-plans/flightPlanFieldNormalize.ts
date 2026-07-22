export const FLIGHT_PLAN_UPDATE_COLUMNS = [
  "vluchtnummer",
  "omschrijving",
  "waarnemer",
  "piloot",
  "datum",
  "vliegduur",
  "luchtvaartuig",
  "passagiers",
  "hoofdthema",
  "aanvullende",
  "points",
  "status",
] as const;

export type FlightPlanUpdateColumn = (typeof FLIGHT_PLAN_UPDATE_COLUMNS)[number];

export type FlightPlanBodySource = Record<string, unknown>;

export function normalizeFlightPlanUpdateFields(
  source: FlightPlanBodySource
): Record<FlightPlanUpdateColumn, unknown> {
  return {
    vluchtnummer: source.vluchtnummer,
    omschrijving: source.omschrijving,
    waarnemer: source.waarnemer,
    piloot: source.piloot,
    datum: source.datum,
    vliegduur: source.vliegduur,
    luchtvaartuig: source.luchtvaartuig,
    passagiers: source.passagiers,
    hoofdthema: source.hoofdthema,
    aanvullende: source.aanvullende,
    points: source.points,
    status: source.status,
  };
}

export function flightPlanUpdateValues(source: FlightPlanBodySource): unknown[] {
  const fields = normalizeFlightPlanUpdateFields(source);
  return FLIGHT_PLAN_UPDATE_COLUMNS.map((column) => fields[column]);
}
