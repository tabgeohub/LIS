import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";

export function applyWgs84MapClickCoords(input: {
  longitude: number;
  latitude: number;
}) {
  return getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: input.longitude,
    y: input.latitude,
  });
}
