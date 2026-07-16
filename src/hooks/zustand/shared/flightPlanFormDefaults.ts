import type { FlightPlanFormFieldValues } from "./flightPlanFormTypes";

export const emptyFlightPlanFormFields: FlightPlanFormFieldValues = {
  omschrijving: "",
  waarnemer: "",
  piloot: "",
  datum: "",
  geplandeVliegduur: "",
  typeLuchtvaartuig: "",
  aantalPassagiers: null,
  doelEnHoofdthema: "",
  aanvullendeInfo: "",
};

/** Defaults used by view-plan and duplicate-plan Zustand slices. */
export const viewPlanFlightPlanFormDefaults: FlightPlanFormFieldValues = {
  ...emptyFlightPlanFormFields,
  geplandeVliegduur: "0:00",
  aantalPassagiers: 0,
};

export const defaultFlightPlanFieldLabels = {
  omschrijving: "Omschrijving",
  waarnemer: "Waarnemer",
  piloot: "Piloot",
  datum: "Inspectiedatum",
  geplandeVliegduur: "Geplande vliegduur",
  typeLuchtvaartuig: "Type luchtvaartuig",
  aantalPassagiers: "Aantal passagiers",
  doelEnHoofdthema: "Doel en hoofdthema",
  aanvullendeInfo: "Aanvullende info",
} as const;
