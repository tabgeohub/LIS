import { usePlanDuplicateState } from "../../../helpers/usePlanDuplicateState";
import FlightPlanStandardFields, {
  pickFlightPlanFormFields,
} from "Components/HomePage/Body/Left/Common/FlightPlanForm/FlightPlanStandardFields";
import { useHydrateDuplicateFlightPlanForm } from "./useHydrateDuplicateFlightPlanForm";
import { DuplicateFlightPlanFormHeader } from "./DuplicateFlightPlanFormHeader";
import { useFlightPlanStandardSelectProps } from "Components/HomePage/hooks/flightPlan/useFlightPlanStandardSelectProps";

export default function Form() {
  const selectProps = useFlightPlanStandardSelectProps();
  const store = usePlanDuplicateState();
  const fields = pickFlightPlanFormFields(store);
  useHydrateDuplicateFlightPlanForm(store);

  if (!store.duplicatedFlightPlan) return null;

  return (
    <FlightPlanStandardFields
      fields={fields}
      {...selectProps}
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
