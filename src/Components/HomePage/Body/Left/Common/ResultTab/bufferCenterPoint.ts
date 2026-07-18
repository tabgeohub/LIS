import Point from "@arcgis/core/geometry/Point";

export function bufferCenterPoint(
  point: { latitude: number; longitude: number },
  spatialReference?: __esri.SpatialReference
) {
  return new Point({
    latitude: point.latitude,
    longitude: point.longitude,
    spatialReference,
  });
}
