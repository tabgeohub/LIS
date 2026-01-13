import { useState } from "react";
import Step1 from "./Step1";
import StepNo from "./StepNo";
import StepYes from "./StepYes";

export default function AddToPlan() {
  const [answer, setAnswer] = useState("radio2");
  const [step, setStep] = useState(1);

  return (
    <div className="mt-2 p-1">
      {step === 1 && (
        <Step1 answer={answer} setAnswer={setAnswer} setStep={setStep} />
      )}

      {step === 2 && <StepNo />}

      {step === 3 && <StepYes />}
    </div>
  );
}
