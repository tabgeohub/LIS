import {
  addYellowGraphicsForPoints,
  mergeSelectedPointsIntoPlan,
} from "./mergeSelectedPointsIntoPlan";
import type { SubmitSelectedPointsInput } from "./submitSelectedPointsTypes";

export function buildSubmitSelectedPointsResult(
  input: SubmitSelectedPointsInput
) {
  const merged = mergeSelectedPointsIntoPlan(input);
  addYellowGraphicsForPoints(
    input.checkedPoints,
    input.yellowGraphicsLayer
  );
  return {
    payload: { points: merged.uniqueIds, id: input.selectedPlan.id },
    updatedPlan: merged.updatedPlan,
    updatedPoints: merged.updatedPoints,
    updatedFilteredPlans: merged.updatedFilteredPlans,
  };
}
