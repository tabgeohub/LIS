import { getTransformedCoordinates } from "./getTransformedCoordinates";
import type { PointData } from "./pointGraphicTypes";

export function getPointCoordinates(
  point: PointData,
  transformCoordinates = true
): { longitude: number; latitude: number } | null {
  let longitude = point.longitude;
  let latitude = point.latitude;

  if (
    transformCoordinates &&
    (typeof longitude !== "number" || typeof latitude !== "number") &&
    typeof point.xcoordinaat_rd === "number" &&
    typeof point.ycoordinaat_rd === "number"
  ) {
    const transformed = getTransformedCoordinates({
      fromProjection: "RD",
      toProjection: "WGS84",
      x: point.xcoordinaat_rd,
      y: point.ycoordinaat_rd,
    });
    longitude = transformed.x;
    latitude = transformed.y;
  }

  return typeof longitude === "number" && typeof latitude === "number"
    ? { longitude, latitude }
    : null;
}
