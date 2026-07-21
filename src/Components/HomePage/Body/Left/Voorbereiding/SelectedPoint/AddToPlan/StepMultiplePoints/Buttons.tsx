import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useUpdateData } from "utils/useUpdateData";
import type { AddToPlanStepButtonsProps } from "../addToPlanStepButtonsProps";
import { useAddToPlanWizardNavigation } from "../addToPlanWizardNavigation";
import { AddToPlanWizardButtonBar } from "../AddToPlanWizardButtonBar";
import { submitAddToPlanSelection } from "../submitAddToPlanSelection";

export default function Buttons({
  setSubStep,
  setStep,
  selectedPlan,
}: AddToPlanStepButtonsProps) {
  const { cancelToKaartlagenlijst, setSelectedBottomTab } =
    useAddToPlanWizardNavigation();
  const { setPolygonPoints, polygonPoints } = usePointsStore();
  const { yellowGraphicsLayer } = useMapViewState();
  const { update } = useUpdateData(`/flightPlans/vluchtplans/points`);

  function handleSubmit() {
    submitAddToPlanSelection({
      selectedPlan,
      addedPointIds: polygonPoints.map((point) => point.id),
      setSubStep,
      update,
      onSuccess: () => setSelectedBottomTab("Kaartlagenlijst"),
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
