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
  const uniquePointIds = buildUniquePointIds({
    plan: input.selectedPlan,
    selectedPointIds: input.selectedPointIds,
    selectedGeometryIds: input.selectedGeometryIds,
    dbGeometries: input.dbGeometries,
  });

  const updatedGeometries = mergeGeometries({
    existing: input.selectedPlan.geometries,
    newlySelectedIds: input.selectedGeometryIds,
    allGeometries: input.dbGeometries,
  });

  const standalonePoints = resolveStandalonePoints({
    allPointIds: uniquePointIds,
    dbPoints: input.dbPoints,
    geometries: updatedGeometries,
  });

  const vertexIds = getGeometryVertexIds(updatedGeometries);
  const newlySelectedStandalonePoints = input.dbPoints.filter(
    (p) => input.selectedPointIds.includes(p.id) && !vertexIds.has(p.id)
  );

  input.update({
    data: {
      points: uniquePointIds,
      id: input.selectedPlan.id,
    },
    onSuccess: () => {
      const updatedPlan: FlightPlanType = {
        ...input.selectedPlan,
        points: standalonePoints,
        pointsObjects: standalonePoints,
        geometries: updatedGeometries,
      };

      input.setSelectedPlan(updatedPlan);
      input.setPointsTable(standalonePoints);
      input.setGeometriesTable(updatedGeometries);
      input.setGeometries(updatedGeometries);
      input.setOpenTable(true);

      newlySelectedStandalonePoints.forEach((point) =>
        drawYellowPoint(point, input.yellowGraphicsLayer ?? null)
      );

      drawYellowGeometries(updatedGeometries, input.yellowGraphicsLayer ?? null);

      input.setFilteredPlans(
        input.filteredPlans.map((p) =>
          p.id === input.selectedPlan.id
            ? {
                ...p,
                points: standalonePoints,
                pointsObjects: standalonePoints,
                geometries: updatedGeometries,
              }
            : p
        )
      );

      input.logAction({
        message: "User saved points and geometries to flight plan",
        newData: {
          planId: input.selectedPlan.id,
          pointIds: uniquePointIds,
          geometryIds: updatedGeometries.map((g) => g.id),
        },
      });

      input.setStep(2);
    },
  });
}
