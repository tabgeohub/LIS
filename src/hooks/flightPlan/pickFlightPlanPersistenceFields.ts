import type { FlightPlanPersistenceFields } from "Types";

/** Keys of the 9 DB persistence fields shared by pick/merge/log helpers. */
export const FLIGHT_PLAN_PERSISTENCE_KEYS = [
  "omschrijving",
  "waarnemer",
  "piloot",
  "datum",
  "vliegduur",
  "luchtvaartuig",
  "passagiers",
  "hoofdthema",
  "aanvullende",
] as const satisfies ReadonlyArray<keyof FlightPlanPersistenceFields>;

/** Pick the 9 DB persistence fields from a plan-like object (update payloads / logging). */
export function pickFlightPlanPersistenceFields(
  plan: FlightPlanPersistenceFields
): FlightPlanPersistenceFields {
  const picked = {} as FlightPlanPersistenceFields;
  for (const key of FLIGHT_PLAN_PERSISTENCE_KEYS) {
    picked[key] = plan[key] as never;
  }
  return picked;
}

/** Merge persistence fields from an API result onto an existing plan object. */
export function mergeFlightPlanPersistenceFields<
  T extends FlightPlanPersistenceFields,
>(plan: T, result: Partial<FlightPlanPersistenceFields>): T {
  const patch = {} as FlightPlanPersistenceFields;
  for (const key of FLIGHT_PLAN_PERSISTENCE_KEYS) {
    patch[key] = (result[key] ?? plan[key]) as never;
  }
  return { ...plan, ...patch };
}
