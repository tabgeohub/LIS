import { useMemo } from "react";
import { EnrichedPointType } from "Types";
import { sortPointsWithSelectionOrder } from "hooks/points/sortPointsWithSelectionOrder";

export function useSortedPointSelection(
  points: EnrichedPointType[],
  selectedPointIds: number[]
) {
  return useMemo(
    () => sortPointsWithSelectionOrder(points, selectedPointIds),
    [points, selectedPointIds]
  );
}
