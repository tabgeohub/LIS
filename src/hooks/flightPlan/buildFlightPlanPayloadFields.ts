import {
  FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";

export type FlightPlanPayloadFields = FlightPlanFormFieldValues & {
  vluchtnummer?: string;
};

export function buildFlightPlanPayloadFields(
  fields: FlightPlanPayloadFields
): {
  omschrijving: string;
  waarnemer: string;
  piloot: string;
  datum: string;
  vliegduur: string;
  luchtvaartuig: string;
  passagiers: number | null | undefined;
  hoofdthema: string;
  aanvullende: string;
} {
  return {
    omschrijving: fields.omschrijving,
    waarnemer: fields.waarnemer,
    piloot: fields.piloot,
    datum: fields.datum,
    vliegduur: fields.geplandeVliegduur,
    luchtvaartuig: fields.typeLuchtvaartuig,
    passagiers: fields.aantalPassagiers,
    hoofdthema: fields.doelEnHoofdthema,
    aanvullende: fields.aanvullendeInfo,
  };
}
