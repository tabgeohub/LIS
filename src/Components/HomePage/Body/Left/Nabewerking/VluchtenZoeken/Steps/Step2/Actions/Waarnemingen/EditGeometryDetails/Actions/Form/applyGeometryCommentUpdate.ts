import type {
  FinishedFlightPlanType,
  FinishedGeometryType,
  FinishedPointType,
} from "Types/finished_plans";
import { updateGeometryPointsComment } from "./updateGeometryPointsComment";

export async function applyGeometryCommentUpdate(input: {
  selectedGeometry: FinishedGeometryType;
  selectedPlan: FinishedFlightPlanType | null;
  comment: string;
  setSelectedGeometry: (geometry: FinishedGeometryType) => void;
  setSelectedPlan: (plan: FinishedFlightPlanType) => void;
  resetFeatures: () => void;
  setAction: (value: string) => void;
  logAction: (input: {
    message: string;
    step: string;
    newData?: unknown;
  }) => void;
  onSuccessToast: () => void;
  onFailureToast: () => void;
}): Promise<boolean> {
  const validUpdatedPoints = await updateGeometryPointsComment({
    points: input.selectedGeometry.points,
    comment: input.comment,
  });

  if (validUpdatedPoints.length === 0) {
    input.onFailureToast();
    return false;
  }

  input.onSuccessToast();
  input.resetFeatures();
  input.setAction("form");

  const updatedGeometry = {
    ...input.selectedGeometry,
    points: validUpdatedPoints,
  };

  input.setSelectedGeometry(updatedGeometry);

  if (input.selectedPlan) {
    input.setSelectedPlan({
      ...input.selectedPlan,
      geometries: input.selectedPlan.geometries.map((geom) =>
        geom.id === input.selectedGeometry.id ? updatedGeometry : geom
      ),
      points_data: input.selectedPlan.points_data.map((point) => {
        const updatedPoint = validUpdatedPoints.find((p) => p.id === point.id);
        return updatedPoint || point;
      }),
    });
  }

  input.logAction({
    message: "User clicked 'Update' button",
    step: "Second step - Edit geometry",
    newData: {
      geometry_id: input.selectedGeometry.id,
      comment: input.comment,
      specifiek_letten_op: input.comment,
    },
  });

  return true;
}

export type { FinishedPointType };
