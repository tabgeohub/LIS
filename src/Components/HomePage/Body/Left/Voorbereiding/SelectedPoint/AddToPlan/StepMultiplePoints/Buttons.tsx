import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useUpdateData } from "utils/useUpdateData";
import type { AddToPlanStepButtonsProps } from "../addToPlanStepButtonsProps";
import { useAddToPlanWizardNavigation } from "../addToPlanWizardNavigation";
import { AddToPlanWizardButtonBar } from "../AddToPlanWizardButtonBar";

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
    if (selectedPlan === null) return;

    setSubStep(2);
    const selectedIds = selectedPlan.points?.map((p) => p.id) || [];
    const mergedIds = Array.from(new Set([...selectedIds, ...polygonPoints.map((p) => p.id)]));

    update({
      data: { id: selectedPlan.id, points: mergedIds },
      onSuccess: () => setSelectedBottomTab("Kaartlagenlijst"),
    });

    yellowGraphicsLayer?.removeAll();
    setPolygonPoints([]);
  }

  return (
    <AddToPlanWizardButtonBar
      onBack={() => setStep(1)}
      onNext={handleSubmit}
      onCancel={cancelToKaartlagenlijst}
    />
  );
}
