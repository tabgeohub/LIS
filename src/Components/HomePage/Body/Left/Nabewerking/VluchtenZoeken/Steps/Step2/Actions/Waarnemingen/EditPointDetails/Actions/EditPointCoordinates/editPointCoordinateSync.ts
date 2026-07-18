import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { transformWgs84ToRd } from "@helpers/geo/transformWgs84ToRd";
import type { FinishedPointType } from "Types/finished_plans";

export type EditPointCoordSnapshot = {
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
};

export function snapshotPointCoords(
  selectedPoint: FinishedPointType
): EditPointCoordSnapshot {
  return {
    longitude: selectedPoint.longitude || 0,
    latitude: selectedPoint.latitude || 0,
    xcoordinaat_rd: selectedPoint.xcoordinaat_rd || 0,
    ycoordinaat_rd: selectedPoint.ycoordinaat_rd || 0,
  };
}

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
  const transformed = transformWgs84ToRd(longitude, latitude);
  return {
    xcoordinaat_rd: transformed.x,
    ycoordinaat_rd: transformed.y,
  };
}

export function syncCoordsForCoordinateSystem(input: {
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
}): Partial<EditPointCoordSnapshot> | null {
  if (input.coordinateSystem === "RD") {
    return syncFromRd(input.xcoordinaat_rd, input.ycoordinaat_rd);
  }
  if (input.coordinateSystem === "WGS84") {
    return syncFromWgs84(input.longitude, input.latitude);
  }
  return null;
}
