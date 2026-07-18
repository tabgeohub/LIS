import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useUpdateData } from "utils/useUpdateData";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/HomePage/Body/Common/Wizard/wizardButtonBarClass";
import type { AddToPlanStepButtonsProps } from "../addToPlanStepButtonsProps";
import { useAddToPlanWizardNavigation } from "../addToPlanWizardNavigation";

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
    <WizardButtonBar
      className={WIZARD_BUTTON_BAR_CLASS}
      buttons={[
        { label: "Vorige", onClick: () => setStep(1) },
        { label: "Volgende", onClick: handleSubmit },
        {
          label: "Annuleren",
          onClick: cancelToKaartlagenlijst,
        },
      ]}
    />
  );
}
