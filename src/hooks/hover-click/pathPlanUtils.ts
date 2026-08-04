import { getDistanceMeters } from "@helpers/geo/getDistanceMeters";

export type PathPoint = {
  longitude: number;
  latitude: number;
  altitude?: number;
  speed?: number;
  rotationAngle?: number;
};

export function parsePlanPath(rawPath: unknown): PathPoint[] {
  if (Array.isArray(rawPath)) return rawPath as PathPoint[];

  if (typeof rawPath === "string") {
    try {
      const parsed = JSON.parse(rawPath);
      if (Array.isArray(parsed)) return parsed as PathPoint[];
    } catch {
      return [];
    }
  }

  return [];
}

export function findNearestPathPoint(input: {
  planPath: PathPoint[];
  latitude: number;
  longitude: number;
  maxDistanceM: number;
}): PathPoint | null {
  let nearest: PathPoint | null = null;
  let minDistance = Infinity;

  for (const point of input.planPath) {
    const dist = getDistanceMeters({
      from: { lat: point.latitude, lon: point.longitude },
      to: { lat: input.latitude, lon: input.longitude },
    });
    if (dist < minDistance) {
      minDistance = dist;
      nearest = point;
    }
  }

  if (!nearest || minDistance > input.maxDistanceM) return null;
  return nearest;
}
