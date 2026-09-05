import { FlightPlanType } from "Types";

export type PlanInformationProps = {
  selectedPlan: FlightPlanType;
  setSelectedPlan: (value: FlightPlanType | null) => void;
  setStep: (value: number) => void;
};
