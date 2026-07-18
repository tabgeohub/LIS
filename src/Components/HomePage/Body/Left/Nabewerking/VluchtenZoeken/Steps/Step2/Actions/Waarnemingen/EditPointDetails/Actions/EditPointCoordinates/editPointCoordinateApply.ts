import type { FinishedPointType } from "Types/finished_plans";
import {
  snapshotPointCoords,
  syncCoordsForCoordinateSystem,
  type EditPointCoordSnapshot,
} from "./editPointCoordinateSync";

export function applySelectedPointCoords(input: {
  selectedPoint: FinishedPointType;
  setLongitude: (v: number) => void;
  setLatitude: (v: number) => void;
  setXCoordinaat_rd: (v: number) => void;
  setYCoordinaat_rd: (v: number) => void;
}): EditPointCoordSnapshot {
  const next = snapshotPointCoords(input.selectedPoint);
  input.setLongitude(next.longitude);
  input.setLatitude(next.latitude);
  input.setXCoordinaat_rd(next.xcoordinaat_rd);
  input.setYCoordinaat_rd(next.ycoordinaat_rd);
  return next;
}

export function applyCoordinateSystemPatch(input: {
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
  setLongitude: (v: number) => void;
  setLatitude: (v: number) => void;
  setXCoordinaat_rd: (v: number) => void;
  setYCoordinaat_rd: (v: number) => void;
}) {
  const patch = syncCoordsForCoordinateSystem(input);
  if (!patch) return;
  if (patch.longitude != null) input.setLongitude(patch.longitude);
  if (patch.latitude != null) input.setLatitude(patch.latitude);
  if (patch.xcoordinaat_rd != null) input.setXCoordinaat_rd(patch.xcoordinaat_rd);
  if (patch.ycoordinaat_rd != null) input.setYCoordinaat_rd(patch.ycoordinaat_rd);
}
