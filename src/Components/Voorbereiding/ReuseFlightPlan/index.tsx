import Step1 from "./Steps/Step1";
import { useReuseFlightPlan } from "Components/Voorbereiding/ReuseFlightPlan/useReuseFlightPlan";
import Step2 from "./Steps/Step2";

export default function ReuseFlightPlan() {
  const { step } = useReuseFlightPlan();

  return (
    <div className="h-full">
      {step === 1 && <Step1 />}

      {step === 2 && <Step2 />}
    </div>
  );
}
