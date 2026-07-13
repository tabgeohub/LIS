import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features/useGeometriesStore";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import {
  buildUniquePointIds,
  getGeometryVertexIds,
  mergeGeometries,
  resolveStandalonePoints,
} from "./planSelection";
import { drawYellowGeometries, drawYellowPoint } from "./drawYellowPlanGraphics";

type SubmitAddPointsToPlanInput = {
  selectedPlan: FlightPlanType;
  selectedPointIds: number[];
  selectedGeometryIds: number[];
  dbPoints: EnrichedPointType[];
  dbGeometries: Geometry[];
  yellowGraphicsLayer: GraphicsLayer | null | undefined;
  update: (args: {
    data: { points: number[]; id: number };
    onSuccess: () => void;
  }) => void;
  setSelectedPlan: (plan: FlightPlanType) => void;
  setPointsTable: (points: EnrichedPointType[]) => void;
  setGeometriesTable: (geometries: Geometry[]) => void;
  setGeometries: (geometries: Geometry[]) => void;
  setOpenTable: (open: boolean) => void;
  filteredPlans: FlightPlanType[];
  setFilteredPlans: (plans: FlightPlanType[]) => void;
  logAction: (input: {
    message: string;
    newData?: Record<string, unknown>;
  }) => void;
  setStep: (step: number) => void;
};

export function submitAddPointsToPlan(input: SubmitAddPointsToPlanInput) {
  const {
    selectedPlan,
    selectedPointIds,
    selectedGeometryIds,
    dbPoints,
    dbGeometries,
    yellowGraphicsLayer,
    update,
    setSelectedPlan,
    setPointsTable,
    setGeometriesTable,
    setGeometries,
    setOpenTable,
    filteredPlans,
    setFilteredPlans,
    logAction,
    setStep,
  } = input;

  const uniquePointIds = buildUniquePointIds({
    plan: selectedPlan,
    selectedPointIds,
    selectedGeometryIds,
    dbGeometries,
  });

  const updatedGeometries = mergeGeometries({
    existing: selectedPlan.geometries,
    newlySelectedIds: selectedGeometryIds,
    allGeometries: dbGeometries,
  });

  const standalonePoints = resolveStandalonePoints({
    allPointIds: uniquePointIds,
    dbPoints,
    geometries: updatedGeometries,
  });

  const vertexIds = getGeometryVertexIds(updatedGeometries);
  const newlySelectedStandalonePoints = dbPoints.filter(
    (p) => selectedPointIds.includes(p.id) && !vertexIds.has(p.id)
  );

  update({
    data: {
      points: uniquePointIds,
      id: selectedPlan.id,
    },
    onSuccess: () => {
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
    },
  });
}
