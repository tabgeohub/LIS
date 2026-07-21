import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
import type { AddToPlanStepButtonsProps } from "../addToPlanStepButtonsProps";
import { AddToPlanWizardButtonBar } from "../AddToPlanWizardButtonBar";
import { useAddToPlanStepButtons } from "../useAddToPlanStepButtons";

export default function Buttons(props: AddToPlanStepButtonsProps) {
  const { setStep, cancelToKaartlagenlijst, submitSelection } =
    useAddToPlanStepButtons(props);
  const { setPolygonPoints, polygonPoints } = usePointsStore();
  const { yellowGraphicsLayer } = useMapViewState();

  function handleSubmit() {
    submitSelection({
      addedPointIds: polygonPoints.map((point) => point.id),
      afterSubmit: () => {
        yellowGraphicsLayer?.removeAll();
        setPolygonPoints([]);
      },
    });
  }

  return (
    <AddToPlanWizardButtonBar
      onBack={() => setStep(1)}
      onNext={handleSubmit}
      onCancel={cancelToKaartlagenlijst}
    />
  );
}
