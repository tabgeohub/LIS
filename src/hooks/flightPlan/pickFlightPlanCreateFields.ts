import type { FlightPlanPayloadFields } from "./usePopulateFlightPlanFormEffect";
export { pickFlightPlanFormValues } from "hooks/zustand/shared/flightPlanFormFields";
import { pickFlightPlanFormValues } from "hooks/zustand/shared/flightPlanFormFields";

/** Pick create-payload form fields from a wizard zustand slice. */
export function pickFlightPlanCreateFields(store: {
  vluchtnummer?: string;
  omschrijving: string;
  waarnemer: string;
  piloot: string;
  datum: string;
  geplandeVliegduur: string;
  typeLuchtvaartuig: string;
  aantalPassagiers: number | null | undefined;
  doelEnHoofdthema: string;
  aanvullendeInfo: string;
}): FlightPlanPayloadFields {
  return {
    vluchtnummer: store.vluchtnummer,
    ...pickFlightPlanFormValues(store),
  };
}
