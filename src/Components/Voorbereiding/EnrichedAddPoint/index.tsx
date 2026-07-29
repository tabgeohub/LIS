import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useEnrichedAddPointController } from "./useEnrichedAddPointController";

export default function EnrichedAddPoint() {
  const { step, handleCancel } = useEnrichedAddPointController();

  return (
    <div className="mt-4 px-2 h-full">
      {step === 1 && <Step1 handleCancel={handleCancel} />}
      {step === 2 && <Step2 handleCancel={handleCancel} />}
      {step === 3 && <Step3 handleCancel={handleCancel} />}
    </div>
  );
}
