import { getDistanceMeters } from "@helpers/getDistanceMeters";
import { EnrichedPointType } from "Types";

function isCloserCandidate(input: {
  point: EnrichedPointType;
  latitude: number;
  longitude: number;
  minimum: number;
  maxDistanceMeters: number;
}): { nearer: EnrichedPointType | null; minimum: number } {
  if (!input.point.latitude || !input.point.longitude) {
    return { nearer: null, minimum: input.minimum };
  }

  const distance = getDistanceMeters({
    from: { lat: input.point.latitude, lon: input.point.longitude },
    to: { lat: input.latitude, lon: input.longitude },
  });

  if (distance >= input.minimum) {
    return { nearer: null, minimum: input.minimum };
  }

  return {
    nearer: distance <= input.maxDistanceMeters ? input.point : null,
    minimum: distance,
  };
}

export function findNearestPoint(input: {
  points: EnrichedPointType[];
  latitude: number;
  longitude: number;
  maxDistanceMeters: number;
}) {
  let nearest: EnrichedPointType | null = null;
  let minimum = Infinity;

  for (const point of input.points) {
    const candidate = isCloserCandidate({
      point,
      latitude: input.latitude,
      longitude: input.longitude,
      minimum,
      maxDistanceMeters: input.maxDistanceMeters,
    });
    if (candidate.nearer) nearest = candidate.nearer;
    minimum = candidate.minimum;
  }

  return nearest;
}
