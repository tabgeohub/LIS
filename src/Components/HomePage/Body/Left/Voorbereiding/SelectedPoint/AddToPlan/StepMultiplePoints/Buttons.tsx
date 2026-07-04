import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { FlightPlanType } from "Types";
import { useUpdateData } from "utils/useUpdateData";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { WIZARD_BUTTON_BAR_CLASS } from "Components/HomePage/Body/Common/Wizard/wizardButtonBarClass";

export default function Buttons({
  setSubStep,
  setStep,
  selectedPlan,
}: {
  setSubStep: (step: number) => void;
  setStep: (step: number) => void;
  selectedPlan: FlightPlanType | null;
}) {
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
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
          onClick: () => {
            setSelectedTab("none");
            setSelectedBottomTab("Kaartlagenlijst");
          },
        },
      ]}
    />
  );
}
