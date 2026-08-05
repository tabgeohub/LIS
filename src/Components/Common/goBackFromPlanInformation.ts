import type { FlightPlanType } from "Types";

/** Shared Vorige handler for Tools / SelectedPoint PlanInformation views. */
export function goBackFromPlanInformation(
  setStep: (value: number) => void,
  setSelectedPlan: (value: FlightPlanType | null) => void
) {
  setStep(1);
  setSelectedPlan(null);
}
