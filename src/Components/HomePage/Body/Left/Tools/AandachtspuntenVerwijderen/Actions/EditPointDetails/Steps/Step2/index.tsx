import { useState } from "react";
import Step2Sub1 from "./Step2Sub1";
import Step2Sub2 from "./Step2Sub2";
import {
  pickDeletePointFormFields,
  useDeletePointState,
} from "hooks/zustand/tools/useDeletePointState";
import { useUpdateData } from "utils/useUpdateData";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";
import { pickPointCoreLogData } from "@helpers/points/buildPointUpdatePayload";
import { submitDeletePointDetailsUpdate } from "../../submitDeletePointDetailsUpdate";

export default function Step2({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();

  const [subStep, setSubStep] = useState(1);
  const { points, setPoints } = usePointsStore();
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const formFields = useDeletePointState(pickDeletePointFormFields);
  const { selectedPoint } = useDeletePointState();

  const { mapView, redGraphicsLayer } = useMapViewState();

  const { update, loading } = useUpdateData(`/points/${selectedPoint?.id}`);

  function handleSubmit() {
    submitDeletePointDetailsUpdate({
      selectedPoint,
      formFields,
      update,
      points,
      setPoints,
      mapView,
      redGraphicsLayer,
      onApplied: () => {
        setStep(1);
        if (!selectedPoint) return;
        logAction({
          message: "User clicked 'Save' button",
          step: "Edit point details - Step 2",
          newData: pickPointCoreLogData(selectedPoint),
        });
      },
    });
  }

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
