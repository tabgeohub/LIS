import type { FinishedPointType } from "Types/finished_plans";
import type { EditPointCoordSnapshot } from "./editPointCoordSnapshot";
import {
  syncFromRd,
  syncFromWgs84,
} from "./editPointCoordSyncTransforms";

export type { EditPointCoordSnapshot };

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
  if (input.coordinateSystem === "RD") {
    return syncFromRd(input.xcoordinaat_rd, input.ycoordinaat_rd);
  }
  if (input.coordinateSystem === "WGS84") {
    return syncFromWgs84(input.longitude, input.latitude);
  }
  return null;
}

export { syncFromRd, syncFromWgs84 };
