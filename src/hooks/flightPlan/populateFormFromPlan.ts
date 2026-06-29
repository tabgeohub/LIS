import { FlightPlanFormFieldSetters } from "hooks/zustand/shared/flightPlanFormFields";

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
  setters.setOmschrijving(plan.omschrijving ?? "");
  setters.setWaarnemer(plan.waarnemer ?? "");
  setters.setPiloot(plan.piloot ?? "");
  setters.setDatum(plan.datum ?? "");
  setters.setGeplandeVliegduur(plan.vliegduur ?? "");
  setters.setTypeLuchtvaartuig(plan.luchtvaartuig ?? "");
  setters.setAantalPassagiers(plan.passagiers ?? null);
  setters.setDoelEnHoofdthema(plan.hoofdthema ?? "");
  setters.setAanvullendeInfo(plan.aanvullende ?? "");
}
