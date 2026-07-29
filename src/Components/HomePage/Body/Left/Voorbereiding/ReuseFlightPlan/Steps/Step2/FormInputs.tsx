import { usePopulateFlightPlanFormEffect } from "Components/HomePage/hooks/flightPlan/usePopulateFlightPlanFormEffect";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import Vluchtnummer from "./Vluchtnummer";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";
import { useFlightPlanStandardSelectProps } from "Components/HomePage/hooks/flightPlan/useFlightPlanStandardSelectProps";

export default function FormInputs() {
  const selectProps = useFlightPlanStandardSelectProps();
  const store = useReuseFlightPlan();
  const fields = pickFlightPlanFormFields(store);

  usePopulateFlightPlanFormEffect(store.selectedPlan, fields);

  return (
    <FlightPlanStandardFields
      className="py-4 px-2 space-y-3"
      fields={fields}
      {...selectProps}
      header={<Vluchtnummer />}
    />
  );
}
