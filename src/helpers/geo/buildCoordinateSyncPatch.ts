import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type { SpatialReference } from "Types";

export type CoordinateSyncPatch = {
  rdX?: number;
  rdY?: number;
  latitude?: number;
  longitude?: number;
};

export function buildCoordinateSyncPatch(input: {
  coordinateSystem: SpatialReference | string;
  rdX: number;
  rdY: number;
  latitude: number;
  longitude: number;
}): CoordinateSyncPatch | null {
  if (input.coordinateSystem === "RD") {
    const transformed = getTransformedCoordinates({
      fromProjection: "RD",
      toProjection: "WGS84",
      x: input.rdX,
      y: input.rdY,
    });
    return { longitude: transformed.x, latitude: transformed.y };
  }

  if (input.coordinateSystem === "WGS84") {
    const transformed = getTransformedCoordinates({
      fromProjection: "WGS84",
      toProjection: "RD",
      x: input.longitude,
      y: input.latitude,
    });
    return { rdX: transformed.x, rdY: transformed.y };
  }

  return null;
}
