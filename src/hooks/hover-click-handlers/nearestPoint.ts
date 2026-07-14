import { getDistanceMeters } from "@helpers/getDistanceMeters";
import { EnrichedPointType } from "Types";

export function findNearestPoint(input: {
  points: EnrichedPointType[];
  latitude: number;
  longitude: number;
  maxDistanceMeters: number;
}) {
  let nearest: EnrichedPointType | null = null;
  let minimum = Infinity;
  for (const point of input.points) {
    if (!point.latitude || !point.longitude) continue;
    const distance = getDistanceMeters({
      from: { lat: point.latitude, lon: point.longitude },
      to: { lat: input.latitude, lon: input.longitude },
    });
    if (distance < minimum) {
      minimum = distance;
      nearest = distance <= input.maxDistanceMeters ? point : null;
    }
  }
  return nearest;
}
