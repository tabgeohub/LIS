import {
  FlightPlanFormFieldSetters,
  FlightPlanFormFieldValues,
} from "hooks/zustand/shared/flightPlanFormFields";
import FlightPlanStandardFieldsView from "./FlightPlanStandardFieldsView";

export type { FlightPlanFieldLabels } from "Components/Common/FlightPlanForm/flightPlanStandardSelectProps";
export { flightPlanStandardSelectProps } from "Components/Common/FlightPlanForm/flightPlanStandardSelectProps";
export type { FlightPlanStandardFieldsProps } from "./FlightPlanStandardFieldsView";

export function pickFlightPlanFormFields(
  store: FlightPlanFormFieldValues & FlightPlanFormFieldSetters
) {
  return {
    omschrijving: store.omschrijving,
    setOmschrijving: store.setOmschrijving,
    waarnemer: store.waarnemer,
    setWaarnemer: store.setWaarnemer,
    piloot: store.piloot,
    setPiloot: store.setPiloot,
    datum: store.datum,
    setDatum: store.setDatum,
    geplandeVliegduur: store.geplandeVliegduur,
    setGeplandeVliegduur: store.setGeplandeVliegduur,
    typeLuchtvaartuig: store.typeLuchtvaartuig,
    setTypeLuchtvaartuig: store.setTypeLuchtvaartuig,
    aantalPassagiers: store.aantalPassagiers,
    setAantalPassagiers: store.setAantalPassagiers,
    doelEnHoofdthema: store.doelEnHoofdthema,
    setDoelEnHoofdthema: store.setDoelEnHoofdthema,
    aanvullendeInfo: store.aanvullendeInfo,
    setAanvullendeInfo: store.setAanvullendeInfo,
  };
}

export default FlightPlanStandardFieldsView;
