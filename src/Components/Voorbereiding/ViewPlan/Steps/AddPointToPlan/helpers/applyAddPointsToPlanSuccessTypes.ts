import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features";
import type { AddPointsPlanTableCallbacks } from "./addPointsPlanTableCallbacks";

export type ApplyAddPointsSuccessInput = AddPointsPlanTableCallbacks & {
  selectedPlan: FlightPlanType;
  uniquePointIds: number[];
  standalonePoints: EnrichedPointType[];
  updatedGeometries: Geometry[];
  newlySelectedStandalonePoints: EnrichedPointType[];
};
