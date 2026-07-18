import type { FinishedFlightPlanType } from "Types/finished_plans";

/** Shared post-edit callbacks for EditPointDetails / EditGeometryDetails. */
export type ObservationEditCallbacks = {
  setSelectedPlan: (plan: FinishedFlightPlanType) => void;
  resetFeatures: () => void;
  setAction: (value: string) => void;
  logAction: (input: {
    message: string;
    step: string;
    newData?: unknown;
  }) => void;
};
