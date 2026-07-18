import type {
  FinishedFlightPlanType,
  FinishedPointType,
} from "Types/finished_plans";
import type { EditPointDetailsPayload } from "./editPointDetailsPayload";

export type SubmitEditPointDetailsInput = {
  selectedPoint: FinishedPointType | null;
  selectedPlan: FinishedFlightPlanType | null;
  omschrijving: string;
  comment: string;
  update: (args: {
    data: EditPointDetailsPayload;
    onSuccess: (responseData: { result?: unknown }) => void;
  }) => void;
  setSelectedPoint: (point: FinishedPointType) => void;
  setSelectedPlan: (plan: FinishedFlightPlanType) => void;
  resetFeatures: () => void;
  setAction: (value: string) => void;
  logAction: (input: {
    message: string;
    step: string;
    newData?: Record<string, unknown>;
  }) => void;
};
