import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";

/** Shared WGS84 → RD transform used by edit-point map-click / sync helpers. */
export function transformWgs84ToRd(longitude: number, latitude: number) {
  return getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: longitude,
    y: latitude,
  });
}
