import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { FlightPlanType } from "Types";
import { useUpdateData } from "utils/useUpdateData";

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

    const selectedIds = selectedPlan?.points?.map((p) => p.id) || [];
    const newIds = polygonPoints.map((p) => p.id);

    const mergedIds = Array.from(new Set([...selectedIds, ...newIds]));

    update(
      {
        id: selectedPlan.id,
        points: mergedIds,
      },
      () => {
        setSelectedBottomTab("Kaartlagenlijst");
      }
    );

    yellowGraphicsLayer?.removeAll();
    setPolygonPoints([]);
  }

  return (
    <div className="flex justify-end gap-x-1 text-[12px] mt-6">
      <button className="gray-button" onClick={() => setStep(1)}>
        Vorige
      </button>

      <button onClick={handleSubmit} className="gray-button">
        Volgende
      </button>

      <button
        onClick={() => {
          setSelectedTab("none");
          setSelectedBottomTab("Kaartlagenlijst");
        }}
        className="gray-button"
      >
        Annuleren
      </button>
    </div>
  );
}
