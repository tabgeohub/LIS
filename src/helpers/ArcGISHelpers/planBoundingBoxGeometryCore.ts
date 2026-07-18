import Polygon from "@arcgis/core/geometry/Polygon";
import type {
  PlanBoundingBoxExtents,
  PlanBoundingBoxPoint,
} from "./planBoundingBoxTypes";

export function getFlightPlanPoints(plan: {
  points?: PlanBoundingBoxPoint[] | null;
  pointsObjects?: PlanBoundingBoxPoint[] | null;
}): PlanBoundingBoxPoint[] {
  return plan.pointsObjects || plan.points || [];
}

function getValidPlanPoints(
  points: PlanBoundingBoxPoint[] | null | undefined
): PlanBoundingBoxPoint[] {
  if (!points?.length) return [];

  return points.filter(
    (point) =>
      typeof point.latitude === "number" &&
      typeof point.longitude === "number" &&
      Number.isFinite(point.latitude) &&
      Number.isFinite(point.longitude)
  );
}

/** Min/max lat/lon envelope for a set of plan points. */
export function getPlanBoundingBoxExtents(
  points: PlanBoundingBoxPoint[] | null | undefined
): PlanBoundingBoxExtents | null {
  const valid = getValidPlanPoints(points);
  if (valid.length === 0) return null;

  return {
    minLat: Math.min(...valid.map((p) => p.latitude)),
    maxLat: Math.max(...valid.map((p) => p.latitude)),
    minLon: Math.min(...valid.map((p) => p.longitude)),
    maxLon: Math.max(...valid.map((p) => p.longitude)),
  };
}

/**
 * Bounding-box polygon used across flight plan map highlights.
 * Ring order matches existing plan click/hover/star graphics.
 */
export function createPlanBoundingBoxPolygon(
  points: PlanBoundingBoxPoint[] | null | undefined
): Polygon | null {
  const extents = getPlanBoundingBoxExtents(points);
  if (!extents) return null;

  const { minLat, maxLat, minLon, maxLon } = extents;

  return new Polygon({
    rings: [
      [
        [minLon, maxLat],
        [maxLon, maxLat],
        [maxLon, minLat],
        [minLon, minLat],
        [minLon, maxLat],
      ],
    ],
    spatialReference: { wkid: 4326 },
  });
}
