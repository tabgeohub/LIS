/* eslint-disable react-hooks/exhaustive-deps */
import { EnrichedPointType } from "Types";
import useDrawYellowMarkers from "./useDrawYellowMarkers";

export default function usePointClick(selectedPoints: EnrichedPointType[]) {
  const validPoints = selectedPoints?.filter((p) => p != null) || [];

  useDrawYellowMarkers({
    selectedPointIds: validPoints.map((p) => p.id),
    points: validPoints,
  });
}
