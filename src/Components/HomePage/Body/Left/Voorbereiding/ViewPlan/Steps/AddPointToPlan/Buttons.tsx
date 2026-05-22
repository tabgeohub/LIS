import { useContent } from "hooks/useContent";
import { useViewPlanState } from "../../helpers/useViewPlanState";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { FlightPlanType } from "Types";
import {
  buildUniquePointIds,
  drawYellowGeometries,
  drawYellowPoint,
  getGeometryVertexIds,
  mergeGeometries,
  resolveStandalonePoints,
} from "./helpers";

export default function Buttons({
  selectedPointIds,
  selectedGeometryIds,
  update,
}: {
  selectedPointIds: number[];
  selectedGeometryIds: number[];
  update: any;
}) {
  const content = useContent();

  const {
    selectedPlan,
    setSelectedPlan,
    setStep,
    filteredPlans,
    setFilteredPlans,
  } = useViewPlanState();

  const { dbPoints } = usePointsStore();
  const { dbGeometries, setGeometries } = useGeometriesStore();
  const { yellowGraphicsLayer } = useMapViewState();
  const { setPointsTable, setGeometriesTable, setOpenTable } = useOpenTable();

  const logAction = useLogAction();

  function handleSubmit() {
    if (!selectedPlan) return;

    const uniquePointIds = buildUniquePointIds(
      selectedPlan,
      selectedPointIds,
      selectedGeometryIds,
      dbGeometries
    );

    const updatedGeometries = mergeGeometries(
      selectedPlan.geometries,
      selectedGeometryIds,
      dbGeometries
    );

    const standalonePoints = resolveStandalonePoints(
      uniquePointIds,
      dbPoints,
      updatedGeometries
    );

    const vertexIds = getGeometryVertexIds(updatedGeometries);
    const newlySelectedStandalonePoints = dbPoints.filter(
      (p) => selectedPointIds.includes(p.id) && !vertexIds.has(p.id)
    );

    update(
      {
        points: uniquePointIds,
        id: selectedPlan.id,
      },
      () => {
        const updatedPlan: FlightPlanType = {
          ...selectedPlan,
          points: standalonePoints,
          pointsObjects: standalonePoints,
          geometries: updatedGeometries,
        };

        setSelectedPlan(updatedPlan);
        setPointsTable(standalonePoints);
        setGeometriesTable(updatedGeometries);
        setGeometries(updatedGeometries);
        setOpenTable(true);

        newlySelectedStandalonePoints.forEach((point) =>
          drawYellowPoint(point, yellowGraphicsLayer)
        );

        drawYellowGeometries(updatedGeometries, yellowGraphicsLayer);

        setFilteredPlans(
          filteredPlans.map((p) =>
            p.id === selectedPlan.id
              ? {
                  ...p,
                  points: standalonePoints,
                  pointsObjects: standalonePoints,
                  geometries: updatedGeometries,
                }
              : p
          )
        );

        logAction({
          message: "User saved points and geometries to flight plan",
          newData: {
            planId: selectedPlan.id,
            pointIds: uniquePointIds,
            geometryIds: updatedGeometries.map((g) => g.id),
          },
        });

        setStep(2);
      }
    );
  }

  return (
    <div className="flex justify-end gap-x-1 text-[12px]">
      <button
        onClick={() => {
          setStep(2);

          logAction({
            message: "User clicked 'Next' button",
            step: "Third step",
          });
        }}
        className="gray-button"
      >
        {content.common.vorige}
      </button>

      <button onClick={handleSubmit} className="gray-button">
        {content.common.opslaan}
      </button>
    </div>
  );
}
