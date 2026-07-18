import {
  applyFlightPlanFormValues,
  FlightPlanFormFieldSetters,
} from "hooks/zustand/shared/flightPlanFormFields";
import type { FlightPlanPersistenceFields } from "Types";

export type FlightPlanFormSource = Partial<FlightPlanPersistenceFields>;

export function populateFormFromPlan(
  plan: FlightPlanFormSource,
  setters: FlightPlanFormFieldSetters
): void {
  applyFlightPlanFormValues(setters, {
    omschrijving: plan.omschrijving ?? "",
    waarnemer: plan.waarnemer ?? "",
    piloot: plan.piloot ?? "",
    datum: plan.datum ?? "",
    geplandeVliegduur: plan.vliegduur ?? "",
    typeLuchtvaartuig: plan.luchtvaartuig ?? "",
    aantalPassagiers: plan.passagiers ?? null,
    doelEnHoofdthema: plan.hoofdthema ?? "",
    aanvullendeInfo: plan.aanvullende ?? "",
  });
}
