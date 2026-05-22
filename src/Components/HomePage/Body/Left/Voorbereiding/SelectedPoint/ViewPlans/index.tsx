import PlansList from "./PlansList";
import { useState } from "react";
import PlanInformation from "./PlanInformation";
import { usePointFlightPlans } from "hooks/queries/useFlightPlanQueries";
import { FlightPlanType } from "Types";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";

export default function ViewPlans() {
  const [selectedPlan, setSelectedPlan] = useState<FlightPlanType | null>(null);

  const { clickedPoint } = usePopUpState();

  const [step, setStep] = useState(1);

  const { data: plans } = usePointFlightPlans(clickedPoint?.id);

  if (!plans) return null;

  return (
    <div className="p-1 h-full">
      {step === 1 && (
        <PlansList
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          plans={plans}
          setStep={setStep}
        />
      )}

      {step === 2 && selectedPlan && (
        <PlanInformation
          setSelectedPlan={setSelectedPlan}
          setStep={setStep}
          selectedPlan={selectedPlan}
        />
      )}
    </div>
  );
}
