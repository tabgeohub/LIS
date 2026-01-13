import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

import { useAddPointStates } from "../../../../../../hooks/zustand/useAddPointStates";

export default function AddPointsVluchtPlan() {
  const { step } = useAddPointStates();

  return (
    <div className="h-full">
      {step === 1 && <Step1 />}

      {step === 2 && <Step2 />}

      {step === 3 && <Step3 />}
    </div>
  );
}
