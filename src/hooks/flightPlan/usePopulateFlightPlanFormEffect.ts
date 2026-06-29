import { useEffect } from "react";
import {
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";
import {
  FlightPlanFormSource,
  populateFormFromPlan,
} from "./populateFormFromPlan";

export function usePopulateFlightPlanFormEffect(
  selectedPlan: FlightPlanFormSource | null | undefined,
  setters: FlightPlanFormFieldSetters
): void {
  useEffect(() => {
    if (!selectedPlan) return;
    populateFormFromPlan(selectedPlan, setters);
  }, [selectedPlan]);
}

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
