import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import { renderWizardStep } from "Components/Common/Wizard/renderWizardStep";
import { useReuseFlightPlan } from "Components/Voorbereiding/ReuseFlightPlan/useReuseFlightPlan";

export default function ReuseFlightPlan() {
  const { step } = useReuseFlightPlan();

  return (
    <div className="h-full">
      {renderWizardStep(step, {
        1: <Step1 />,
        2: <Step2 />,
      })}
    </div>
  );
}
