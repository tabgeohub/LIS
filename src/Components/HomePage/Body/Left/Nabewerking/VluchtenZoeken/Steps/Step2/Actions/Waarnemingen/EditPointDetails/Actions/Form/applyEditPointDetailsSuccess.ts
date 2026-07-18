import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import type { EditPointDetailsPayload } from "./editPointDetailsPayload";

export function applyEditPointDetailsSuccess(input: {
  selectedPoint: FinishedPointType;
  selectedPlan: FinishedFlightPlanType;
  omschrijving: string;
  comment: string;
  payload: EditPointDetailsPayload;
  setSelectedPoint: (point: FinishedPointType) => void;
  setSelectedPlan: (plan: FinishedFlightPlanType) => void;
  resetFeatures: () => void;
  setAction: (value: string) => void;
}) {
  const updatedPoint = {
    ...input.selectedPoint,
    omschrijving: input.omschrijving,
    specifiek_letten_op: input.comment,
  };
  input.resetFeatures();
  input.setAction("form");
  input.setSelectedPoint(updatedPoint);
  input.setSelectedPlan({
    ...input.selectedPlan,
    points_data: [
      ...input.selectedPlan.points_data.filter(
        (point) => point.id !== input.payload.id
      ),
      updatedPoint,
    ],
  });
}
