import { FLIGHT_PLAN_UPDATE_COLUMNS } from "../../../shared/flightPlanFields";

export { FLIGHT_PLAN_UPDATE_COLUMNS };

export type FlightPlanUpdateColumn = (typeof FLIGHT_PLAN_UPDATE_COLUMNS)[number];

export type FlightPlanBodySource = Record<string, unknown>;

export function normalizeFlightPlanUpdateFields(
  source: FlightPlanBodySource
): Record<FlightPlanUpdateColumn, unknown> {
  const fields = {} as Record<FlightPlanUpdateColumn, unknown>;
  for (const column of FLIGHT_PLAN_UPDATE_COLUMNS) {
    fields[column] = source[column];
  }
  return fields;
}

export function flightPlanUpdateValues(source: FlightPlanBodySource): unknown[] {
  const fields = normalizeFlightPlanUpdateFields(source);
  return FLIGHT_PLAN_UPDATE_COLUMNS.map((column) => fields[column]);
}
