import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import type { ObservationEditCallbacks } from "../../../common/observationEditCallbacks";
import type { EditPointDetailsPayload } from "./editPointDetailsPayload";

export type SubmitEditPointDetailsInput = ObservationEditCallbacks & {
  selectedPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  omschrijving: string;
  comment: string;
  update: (args: {
    data: EditPointDetailsPayload;
    onSuccess: (responseData: { result?: unknown }) => void;
  }) => void;
  setSelectedPoint: (point: FinishedPointType) => void;
};
