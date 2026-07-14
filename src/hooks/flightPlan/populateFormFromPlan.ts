import {
  applyFlightPlanFormValues,
  FlightPlanFormFieldSetters,
} from "hooks/zustand/shared/flightPlanFormFields";

export type FlightPlanFormSource = {
  omschrijving?: string;
  waarnemer?: string;
  piloot?: string;
  datum?: string;
  vliegduur?: string;
  luchtvaartuig?: string;
  passagiers?: number | null;
  hoofdthema?: string;
  aanvullende?: string;
};

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
