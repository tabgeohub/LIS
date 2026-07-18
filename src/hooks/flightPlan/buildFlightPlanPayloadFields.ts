import {
  FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";
import type { FlightPlanPersistenceFields } from "Types";

export type FlightPlanPayloadFields = FlightPlanFormFieldValues & {
  vluchtnummer?: string;
};

export function buildFlightPlanPayloadFields(
  fields: FlightPlanPayloadFields
): Omit<FlightPlanPersistenceFields, "passagiers"> & {
  passagiers: number | null | undefined;
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
