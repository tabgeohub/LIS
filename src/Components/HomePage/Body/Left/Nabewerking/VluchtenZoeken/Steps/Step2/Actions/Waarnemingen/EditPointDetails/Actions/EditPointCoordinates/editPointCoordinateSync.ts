import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
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

export function syncCoordsForCoordinateSystem(input: {
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
}): Partial<EditPointCoordSnapshot> | null {
  const {
    coordinateSystem,
    longitude,
    latitude,
    xcoordinaat_rd,
    ycoordinaat_rd,
  } = input;

  if (coordinateSystem === "RD" && xcoordinaat_rd && ycoordinaat_rd) {
    const transformed = getTransformedCoordinates({
      fromProjection: "RD",
      toProjection: "WGS84",
      x: xcoordinaat_rd,
      y: ycoordinaat_rd,
    });
    return { longitude: transformed.x, latitude: transformed.y };
  }

  if (coordinateSystem === "WGS84" && longitude && latitude) {
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

  return null;
}
