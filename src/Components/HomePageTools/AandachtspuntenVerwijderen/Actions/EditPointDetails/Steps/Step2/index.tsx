import { useState } from "react";
import Step2Sub1 from "./Step2Sub1";
import Step2Sub2 from "./Step2Sub2";
import { useDeletePointState } from "Components/HomePageTools/AandachtspuntenVerwijderen/state/useDeletePointState";
import useLogAction from "hooks/useLogAction";
import { pickPointCoreLogData } from "helpers/points/buildPointUpdatePayload";
import { useDeletePointDetailsSubmit } from "../../useDeletePointDetailsSubmit";

export default function Step2({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();
  const [subStep, setSubStep] = useState(1);
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const { selectedPoint } = useDeletePointState();

  const { handleSubmit, loading } = useDeletePointDetailsSubmit(() => {
    setStep(1);
    if (!selectedPoint) return;
    logAction({
      message: "User clicked 'Save' button",
      step: "Edit point details - Step 2",
      newData: pickPointCoreLogData(selectedPoint),
    });
  });

  return (
    <div className="p-2">
      {subStep === 1 && (
        <Step2Sub1
          subStep={subStep}
          setStep={setStep}
          setSubStep={setSubStep}
          isLoading={loading}
          handleSubmit={handleSubmit}
          currentPoint={currentPoint}
          setCurrentPoint={setCurrentPoint}
        />
      )}

      {subStep === 2 && (
        <Step2Sub2 handleSubmit={handleSubmit} setSubStep={setSubStep} />
      )}
    </div>
  );
}
