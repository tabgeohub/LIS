import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import type { EditPointCoordSnapshot } from "./editPointCoordSnapshot";

export function syncFromRd(
  xcoordinaat_rd: number,
  ycoordinaat_rd: number
): Partial<EditPointCoordSnapshot> | null {
  if (!xcoordinaat_rd || !ycoordinaat_rd) return null;
  const transformed = getTransformedCoordinates({
    fromProjection: "RD",
    toProjection: "WGS84",
    x: xcoordinaat_rd,
    y: ycoordinaat_rd,
  });
  return { longitude: transformed.x, latitude: transformed.y };
}

export function syncFromWgs84(
  longitude: number,
  latitude: number
): Partial<EditPointCoordSnapshot> | null {
  if (!longitude || !latitude) return null;
  const transformed = getTransformedCoordinates({
    fromProjection: "WGS84",
    toProjection: "RD",
    x: longitude,
    y: latitude,
  });
  return {
    xcoordinaat_rd: transformed.x,
    ycoordinaat_rd: transformed.y,
  };
}
