import { useEffect } from "react";
import { FlightPlanFormFieldSetters } from "hooks/zustand/shared/flightPlanFormFields";
import {
  FlightPlanFormSource,
  populateFormFromPlan,
} from "./populateFormFromPlan";

export type { FlightPlanPayloadFields } from "./buildFlightPlanPayloadFields";
export { buildFlightPlanPayloadFields } from "./buildFlightPlanPayloadFields";

export function usePopulateFlightPlanFormEffect(
  selectedPlan: FlightPlanFormSource | null | undefined,
  setters: FlightPlanFormFieldSetters
): void {
  useEffect(() => {
    if (!selectedPlan) return;
    populateFormFromPlan(selectedPlan, setters);
  }, [selectedPlan]);
}
