import type { FlightPlanPersistenceFields } from "Types";

/** Pick the 9 DB persistence fields from a plan-like object (update payloads / logging). */
export function pickFlightPlanPersistenceFields(
  plan: FlightPlanPersistenceFields
): FlightPlanPersistenceFields {
  return {
    omschrijving: plan.omschrijving,
    waarnemer: plan.waarnemer,
    piloot: plan.piloot,
    datum: plan.datum,
    vliegduur: plan.vliegduur,
    luchtvaartuig: plan.luchtvaartuig,
    passagiers: plan.passagiers,
    hoofdthema: plan.hoofdthema,
    aanvullende: plan.aanvullende,
  };
}

/** Merge persistence fields from an API result onto an existing plan object. */
export function mergeFlightPlanPersistenceFields<T extends FlightPlanPersistenceFields>(
  plan: T,
  result: Partial<FlightPlanPersistenceFields>
): T {
  return {
    ...plan,
    ...pickFlightPlanPersistenceFields({
      omschrijving: (result.omschrijving ?? plan.omschrijving) as string,
      waarnemer: (result.waarnemer ?? plan.waarnemer) as string,
      piloot: (result.piloot ?? plan.piloot) as string,
      datum: (result.datum ?? plan.datum) as string,
      vliegduur: (result.vliegduur ?? plan.vliegduur) as string,
      luchtvaartuig: (result.luchtvaartuig ?? plan.luchtvaartuig) as string,
      passagiers: (result.passagiers ?? plan.passagiers) as number,
      hoofdthema: (result.hoofdthema ?? plan.hoofdthema) as string,
      aanvullende: (result.aanvullende ?? plan.aanvullende) as string,
    }),
  };
}
