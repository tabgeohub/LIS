import { useMapViewState } from "hooks/zustand/ui";
import { useOpenTable } from "hooks/zustand/ui";
import { usePointsStore } from "hooks/features";
import { useUpdateData } from "api-hooks/mutations";
import { useViewPlanState } from "Components/Voorbereiding/ViewPlan/useViewPlanState";
import { useContent } from "hooks/useContent";
import {
  applyRemovePointSuccessState,
  buildRemovePointPlanAttributes,
} from "./removePointSuccess";

export default function RemovePoint() {
  const { clickedPoint, setStep, selectedPlan, setSelectedPlan } =
    useViewPlanState();

  const { pointsTable, setPointsTable, geometriesTable, setGeometriesTable } =
    useOpenTable();
  const { setPoints } = usePointsStore();
  const { pointsGraphicsLayer, yellowGraphicsLayer } = useMapViewState();
  const { update: updatePlans } = useUpdateData(`/flightPlans/vluchtplans`);
  const content = useContent();

  const removePoint = (idToRemove: string) => {
    if (!selectedPlan) return;

    const pointToUpdate = selectedPlan.points.find(
      (p) => p.id === pointsTable[clickedPoint].id
    );
    if (!pointToUpdate) return;

    updatePlans({
      data: buildRemovePointPlanAttributes({
        selectedPlan,
        pointIdToRemove: pointToUpdate.id,
      }),
      onSuccess: (responseData) =>
        applyRemovePointSuccessState({
          selectedPlan,
          pointIdToRemove: pointToUpdate.id,
          responseData,
          idToRemove,
          pointsTable,
          geometriesTable,
          pointsGraphicsLayer,
          yellowGraphicsLayer,
          setSelectedPlan,
          setStep,
          setPointsTable,
          setGeometriesTable,
          setPoints,
        }),
    });
  };

  return (
    <button
      onClick={() => removePoint(pointsTable[clickedPoint].id.toString())}
      className="gray-button"
    >
      {content.voorbereiding.vluchtplanInformatie.editPointStep.ontkoppelen}
    </button>
  );
}
