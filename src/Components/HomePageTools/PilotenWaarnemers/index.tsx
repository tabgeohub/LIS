import { useEffect } from "react";
import Chooser from "./Chooser";
import PilotenManager from "./Piloten";
import WaarnemersManager from "./Waarnemers";
import {
  usePilotenWaarnemersStep,
  type PilotenWaarnemersStep,
} from "./usePilotenWaarnemersStep";

export type { PilotenWaarnemersStep };

export default function PilotenWaarnemers() {
  const { step, setStep, reset } = usePilotenWaarnemersStep();

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <div className="h-full">
      {step === "chooser" && <Chooser setStep={setStep} />}
      {step === "piloten" && <PilotenManager setStep={setStep} />}
      {step === "waarnemers" && <WaarnemersManager setStep={setStep} />}
    </div>
  );
}
