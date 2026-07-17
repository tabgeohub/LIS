import {
  FinishedFlightPlanType,
  FinishedGeometryType,
} from "Types/finished_plans";
import {
  averageCoordinates,
  isFiniteCoordinate,
} from "./centerAndZoomMath";

type LatLon = { lat: number; lon: number };

export function geometryCentroid(
  g: FinishedGeometryType
): { lat: number; lon: number } | null {
  const points = (g.points ?? []).filter(isFiniteCoordinate);
  if (points.length === 0) return null;
  const center = averageCoordinates(points);
  return { lat: center.latitude, lon: center.longitude };
}

/** All standalone points plus one centroid per geometry (for map extent / center). */
export function collectPointsForCenterAndZoom(
  plan: FinishedFlightPlanType | null | undefined
): { latitude: number; longitude: number }[] {
  if (!plan) return [];

  const pointsData = Array.isArray(plan.points_data) ? plan.points_data : [];
  const standalonePoints = pointsData
    .filter(isFiniteCoordinate)
    .map(({ latitude, longitude }) => ({ latitude, longitude }));

  const geometries = Array.isArray(plan.geometries) ? plan.geometries : [];
  const geometryCenters = geometries
    .map((geometry) => (geometry ? geometryCentroid(geometry) : null))
    .filter((center): center is LatLon => center !== null)
    .map(({ lat, lon }) => ({ latitude: lat, longitude: lon }));

  return [...standalonePoints, ...geometryCenters];
}
