import { usePopulateFlightPlanFormEffect } from "hooks/flightPlan/usePopulateFlightPlanFormEffect";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import Vluchtnummer from "./Vluchtnummer";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";
import { useFlightPlanFormSelectOptions } from "hooks/flightPlan/useFlightPlanFormSelectOptions";
import { defaultFlightPlanFieldLabels } from "hooks/zustand/shared/flightPlanFormFields";

export default function FormInputs() {
  const { pilootOptions, waarnemerOptions, typeLuchtvaartuigOptions } =
    useFlightPlanFormSelectOptions();
  const store = useReuseFlightPlan();
  const fields = pickFlightPlanFormFields(store);

  usePopulateFlightPlanFormEffect(store.selectedPlan, fields);

  return (
    <FlightPlanStandardFields
      className="py-4 px-2 space-y-3"
      fields={fields}
      labels={defaultFlightPlanFieldLabels}
      pilootOptions={pilootOptions}
      waarnemerOptions={waarnemerOptions}
      typeLuchtvaartuigOptions={typeLuchtvaartuigOptions}
      header={<Vluchtnummer />}
    />
  );
}
