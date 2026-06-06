import Point from "@arcgis/core/geometry/Point";

export interface FlightPlanCentroidPoint {
  latitude: number;
  longitude: number;
}

/**
 * Average center of flight plan points (arithmetic mean of lat/lon).
 * Returns null when there are no valid coordinates.
 */
export function computeFlightPlanCentroid(
  points: FlightPlanCentroidPoint[] | null | undefined
): Point | null {
  if (!points?.length) return null;

  const valid = points.filter(
    (point) =>
      typeof point.latitude === "number" &&
      typeof point.longitude === "number" &&
      Number.isFinite(point.latitude) &&
      Number.isFinite(point.longitude)
  );

  if (valid.length === 0) return null;

  const sum = valid.reduce(
    (acc, point) => {
      acc.longitude += point.longitude;
      acc.latitude += point.latitude;
      return acc;
    },
    { longitude: 0, latitude: 0 }
  );

  return new Point({
    longitude: sum.longitude / valid.length,
    latitude: sum.latitude / valid.length,
    spatialReference: { wkid: 4326 },
  });
}
