import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useAddPointStepController } from "./useAddPointStepController";

export default function AddPointStep() {
  const { addPointStep, setAddPointStep, handleCancel, resetFormAndState } =
    useAddPointStepController();
  return (
    <div className="mt-4 px-2 h-full">
      {addPointStep === 1 && (
        <Step1 handleCancel={handleCancel} setAddPointStep={setAddPointStep} />
      )}
      {addPointStep === 2 && (
        <Step2 handleCancel={handleCancel} setAddPointStep={setAddPointStep} />
      )}
      {addPointStep === 3 && (
        <Step3
          handleCancel={handleCancel}
          resetFormAndState={resetFormAndState}
          setStepAdd={setAddPointStep}
        />
      )}
    </div>
  );
}
