import { FlightPlanType } from "Types";

/** Shared props for SelectedPoint AddToPlan step button bars. */
export type AddToPlanStepButtonsProps = {
  setSubStep: (step: number) => void;
  setStep: (step: number) => void;
  selectedPlan: FlightPlanType | null;
};
