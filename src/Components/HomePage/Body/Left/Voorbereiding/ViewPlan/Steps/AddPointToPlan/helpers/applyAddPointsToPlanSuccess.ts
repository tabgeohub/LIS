import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features/useGeometriesStore";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { drawYellowGeometries, drawYellowPoint } from "./drawYellowPlanGraphics";
import type { ApplyAddPointsSuccessInput } from "./applyAddPointsToPlanSuccessTypes";

export type { ApplyAddPointsSuccessInput } from "./applyAddPointsToPlanSuccessTypes";

function applyPlanTableState(input: ApplyAddPointsSuccessInput) {
  const updatedPlan: FlightPlanType = {
    ...input.selectedPlan,
    points: input.standalonePoints,
    pointsObjects: input.standalonePoints,
    geometries: input.updatedGeometries,
  };
  input.setSelectedPlan(updatedPlan);
  input.setPointsTable(input.standalonePoints);
  input.setGeometriesTable(input.updatedGeometries);
  input.setGeometries(input.updatedGeometries);
  input.setOpenTable(true);
}

function drawNewYellowSelections(input: {
  newlySelectedStandalonePoints: EnrichedPointType[];
  updatedGeometries: Geometry[];
  yellowGraphicsLayer: GraphicsLayer | null | undefined;
}) {
  input.newlySelectedStandalonePoints.forEach((point) =>
    drawYellowPoint(point, input.yellowGraphicsLayer ?? null)
  );
  drawYellowGeometries(input.updatedGeometries, input.yellowGraphicsLayer ?? null);
}

function syncFilteredPlansAfterAdd(input: ApplyAddPointsSuccessInput) {
  input.setFilteredPlans(
    input.filteredPlans.map((p) =>
      p.id === input.selectedPlan.id
        ? {
            ...p,
            points: input.standalonePoints,
            pointsObjects: input.standalonePoints,
            geometries: input.updatedGeometries,
          }
        : p
    )
  );
}

export function applyAddPointsToPlanSuccess(input: ApplyAddPointsSuccessInput) {
  applyPlanTableState(input);
  drawNewYellowSelections(input);
  syncFilteredPlansAfterAdd(input);
  input.logAction({
    message: "User saved points and geometries to flight plan",
    newData: {
      planId: input.selectedPlan.id,
      pointIds: input.uniquePointIds,
      geometryIds: input.updatedGeometries.map((g) => g.id),
    },
  });
  input.setStep(2);
}
