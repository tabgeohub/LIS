import PlansList from "./PlansList";
import { useState } from "react";
import PlanInformation from "./PlanInformation";
import { useReadData } from "utils/useReadData";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { FlightPlanType } from "Types";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";

export default function ViewPlans() {
  const [selectedPlan, setSelectedPlan] = useState<FlightPlanType | null>(null);

  const { selectedPoint } = useDeletePointState();

  const [step, setStep] = useState(1);

  const { data: plans, loading } = useReadData<FlightPlanType[]>(
    `/points/flightPlans/${selectedPoint?.id}`
  );

  if (!plans) return null;

  return (
    <div className="p-1 h-full">
      {loading && <LoadingBars />}

      {step === 1 && (
        <PlansList
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          plans={plans}
          setStep={setStep}
          step={step}
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
