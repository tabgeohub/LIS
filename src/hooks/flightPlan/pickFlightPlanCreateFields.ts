import type { FlightPlanPayloadFields } from "./usePopulateFlightPlanFormEffect";

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
    omschrijving: store.omschrijving,
    waarnemer: store.waarnemer,
    piloot: store.piloot,
    datum: store.datum,
    geplandeVliegduur: store.geplandeVliegduur,
    typeLuchtvaartuig: store.typeLuchtvaartuig,
    aantalPassagiers: store.aantalPassagiers,
    doelEnHoofdthema: store.doelEnHoofdthema,
    aanvullendeInfo: store.aanvullendeInfo,
  };
}
