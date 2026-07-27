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

type CoordinateSystemPatchSetters = {
  setLongitude: (v: number) => void;
  setLatitude: (v: number) => void;
  setXCoordinaat_rd: (v: number) => void;
  setYCoordinaat_rd: (v: number) => void;
};

function applyPatchField(
  value: number | null | undefined,
  setter: (v: number) => void
) {
  if (value != null) setter(value);
}

export function applyCoordinateSystemPatch(input: {
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
} & CoordinateSystemPatchSetters) {
  const patch = syncCoordsForCoordinateSystem(input);
  if (!patch) return;
  applyPatchField(patch.longitude, input.setLongitude);
  applyPatchField(patch.latitude, input.setLatitude);
  applyPatchField(patch.xcoordinaat_rd, input.setXCoordinaat_rd);
  applyPatchField(patch.ycoordinaat_rd, input.setYCoordinaat_rd);
}
