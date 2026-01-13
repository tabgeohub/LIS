import { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { EnrichedPointType, FlightPlanType } from "Types";

export default function AddPoint({
  setFase,
  flightPlansData,
  pointsData,
}: {
  setFase: (value: string) => void;
  flightPlansData: FlightPlanType[];
  pointsData: EnrichedPointType[];
}) {
  const [step, setStep] = useState<number>(1);

  return (
    <div>
      {step === 1 && <Step1 setStep={setStep} setFase={setFase} />}

      {step === 2 && (
        <Step2
          setStep={setStep}
          setFase={setFase}
          flightPlansData={flightPlansData}
          pointsData={pointsData}
        />
      )}
    </div>
  );
}
