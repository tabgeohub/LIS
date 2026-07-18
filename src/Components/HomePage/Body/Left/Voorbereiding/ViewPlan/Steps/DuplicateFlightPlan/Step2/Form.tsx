import { useFlightPlanFormSelectOptions } from "hooks/flightPlan/useFlightPlanFormSelectOptions";
import { usePlanDuplicateState } from "../../../helpers/usePlanDuplicateState";
import FlightPlanStandardFields, {
  flightPlanStandardSelectProps,
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";
import { useHydrateDuplicateFlightPlanForm } from "./useHydrateDuplicateFlightPlanForm";
import { DuplicateFlightPlanFormHeader } from "./DuplicateFlightPlanFormHeader";

export default function Form() {
  const { pilootOptions, waarnemerOptions, typeLuchtvaartuigOptions } =
    useFlightPlanFormSelectOptions();
  const store = usePlanDuplicateState();
  const fields = pickFlightPlanFormFields(store);
  useHydrateDuplicateFlightPlanForm(store);

  if (!store.duplicatedFlightPlan) return null;

  return (
    <FlightPlanStandardFields
      fields={fields}
      {...flightPlanStandardSelectProps({
        pilootOptions,
        waarnemerOptions,
        typeLuchtvaartuigOptions,
      })}
      header={
        <DuplicateFlightPlanFormHeader
          aanmaker={store.aanmaker}
          setAanmaker={store.setAanmaker}
          aanmaaldatum={store.aanmaaldatum}
          setAanmaaldatum={store.setAanmaaldatum}
        />
      }
    />
  );
}
