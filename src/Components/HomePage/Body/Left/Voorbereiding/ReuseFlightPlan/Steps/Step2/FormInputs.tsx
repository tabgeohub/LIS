import { usePopulateFlightPlanFormEffect } from "hooks/flightPlan/usePopulateFlightPlanFormEffect";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import Vluchtnummer from "./Vluchtnummer";
import FlightPlanStandardFields, {
  flightPlanStandardSelectProps,
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";
import { useFlightPlanFormSelectOptions } from "hooks/flightPlan/useFlightPlanFormSelectOptions";

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
      {...flightPlanStandardSelectProps({
        pilootOptions,
        waarnemerOptions,
        typeLuchtvaartuigOptions,
      })}
      header={<Vluchtnummer />}
    />
  );
}
