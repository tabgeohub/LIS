import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features/useGeometriesStore";
import type { AddPointsPlanTableCallbacks } from "./addPointsPlanTableCallbacks";

export type SubmitAddPointsToPlanInput = AddPointsPlanTableCallbacks & {
  selectedPlan: FlightPlanType;
  selectedPointIds: number[];
  selectedGeometryIds: number[];
  dbPoints: EnrichedPointType[];
  dbGeometries: Geometry[];
  update: (args: {
    data: { points: number[]; id: number };
    onSuccess: () => void;
  }) => void;
};
