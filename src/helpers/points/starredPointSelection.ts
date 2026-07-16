import type { EnrichedPointType } from "Types";

export function mergeStarredPoints(
  starredPoints: EnrichedPointType[],
  pointsToAdd: EnrichedPointType[]
) {
  const combined = [...starredPoints, ...pointsToAdd];
  return Array.from(
    new Map(combined.map((point) => [point.id, point])).values()
  );
}

export function getUnstarredPoints(
  allPoints: EnrichedPointType[],
  starredPoints: EnrichedPointType[]
) {
  const starredIds = new Set(starredPoints.map((point) => point.id));
  return allPoints.filter((point) => !starredIds.has(point.id));
}
