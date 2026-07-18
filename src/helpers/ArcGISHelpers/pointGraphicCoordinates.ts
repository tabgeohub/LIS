import { getTransformedCoordinates } from "./getTransformedCoordinates";
import type { PointData } from "./pointGraphicTypes";

function hasWgs84Coords(longitude: unknown, latitude: unknown): boolean {
  return typeof longitude === "number" && typeof latitude === "number";
}

function hasRdCoords(point: PointData): boolean {
  return (
    typeof point.xcoordinaat_rd === "number" &&
    typeof point.ycoordinaat_rd === "number"
  );
}

function transformRdToWgs84(point: PointData) {
  return getTransformedCoordinates({
    fromProjection: "RD",
    toProjection: "WGS84",
    x: point.xcoordinaat_rd as number,
    y: point.ycoordinaat_rd as number,
  });
}

function asWgs84Pair(
  longitude: unknown,
  latitude: unknown
): { longitude: number; latitude: number } | null {
  if (!hasWgs84Coords(longitude, latitude)) return null;
  return { longitude: longitude as number, latitude: latitude as number };
}

export function getPointCoordinates(
  point: PointData,
  transformCoordinates = true
): { longitude: number; latitude: number } | null {
  let longitude = point.longitude;
  let latitude = point.latitude;

  if (
    transformCoordinates &&
    !hasWgs84Coords(longitude, latitude) &&
    hasRdCoords(point)
  ) {
    const transformed = transformRdToWgs84(point);
    longitude = transformed.x;
    latitude = transformed.y;
  }

  return asWgs84Pair(longitude, latitude);
}
