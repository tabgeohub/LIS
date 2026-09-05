import { EnrichedPointType } from "Types";

export function getPointsSelectionStep(points: EnrichedPointType[]): number {
  return points.at(0)?.herhalen === 1 ? 2 : 3;
}
