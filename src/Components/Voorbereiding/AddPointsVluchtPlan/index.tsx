import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { renderWizardStep } from "Components/Common/Wizard/renderWizardStep";
import { useAddPointStates } from "Components/Voorbereiding/AddPointsVluchtPlan/useAddPointStates";

export default function AddPointsVluchtPlan() {
  const { step } = useAddPointStates();

  return (
    <div className="h-full">
      {renderWizardStep(step, {
        1: <Step1 />,
        2: <Step2 />,
        3: <Step3 />,
      })}
    </div>
  );
}
