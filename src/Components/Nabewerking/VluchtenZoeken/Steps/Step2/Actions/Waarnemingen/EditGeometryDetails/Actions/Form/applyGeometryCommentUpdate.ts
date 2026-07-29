import type {
  FinishedFlightPlanType,
  FinishedGeometryType,
  FinishedPointType,
} from "Types/finished_plans";
import type { ObservationEditCallbacks } from "../../../common/observationEditCallbacks";
import { updateGeometryPointsComment } from "./updateGeometryPointsComment";

export type ApplyGeometryCommentUpdateInput = ObservationEditCallbacks & {
  selectedGeometry: FinishedGeometryType;
  selectedPlan: FinishedFlightPlanType | null;
  comment: string;
  setSelectedGeometry: (geometry: FinishedGeometryType) => void;
  onSuccessToast: () => void;
  onFailureToast: () => void;
};

export function patchPlanAfterGeometryComment(input: {
  selectedPlan: FinishedFlightPlanType;
  selectedGeometryId: number;
  updatedGeometry: FinishedGeometryType;
  validUpdatedPoints: FinishedPointType[];
}): FinishedFlightPlanType {
  return {
    ...input.selectedPlan,
    geometries: input.selectedPlan.geometries.map((geom) =>
      geom.id === input.selectedGeometryId ? input.updatedGeometry : geom
    ),
    points_data: input.selectedPlan.points_data.map((point) => {
      const updatedPoint = input.validUpdatedPoints.find((p) => p.id === point.id);
      return updatedPoint || point;
    }),
  };
}

function logGeometryCommentUpdate(
  input: ApplyGeometryCommentUpdateInput
): void {
  input.logAction({
    message: "User clicked 'Update' button",
    step: "Second step - Edit geometry",
    newData: {
      geometry_id: input.selectedGeometry.id,
      comment: input.comment,
      specifiek_letten_op: input.comment,
    },
  });
}

export function applyGeometryCommentSuccess(
  input: ApplyGeometryCommentUpdateInput,
  validUpdatedPoints: FinishedPointType[]
): void {
  input.onSuccessToast();
  input.resetFeatures();
  input.setAction("form");

  const updatedGeometry = {
    ...input.selectedGeometry,
    points: validUpdatedPoints,
  };
  input.setSelectedGeometry(updatedGeometry);

  if (input.selectedPlan) {
    input.setSelectedPlan(
      patchPlanAfterGeometryComment({
        selectedPlan: input.selectedPlan,
        selectedGeometryId: input.selectedGeometry.id,
        updatedGeometry,
        validUpdatedPoints,
      })
    );
  }
  logGeometryCommentUpdate(input);
}

export async function applyGeometryCommentUpdate(
  input: ApplyGeometryCommentUpdateInput
): Promise<boolean> {
  const validUpdatedPoints = await updateGeometryPointsComment({
    points: input.selectedGeometry.points,
    comment: input.comment,
  });
  if (validUpdatedPoints.length === 0) {
    input.onFailureToast();
    return false;
  }
  applyGeometryCommentSuccess(input, validUpdatedPoints);
  return true;
}

export type { FinishedPointType };
