import type { CoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";
import { applyCoordinateSyncPatchToSetters } from "@helpers/geo/applyCoordinateSyncPatchToSetters";
import {
  pickDeletePointCoordinateFields,
  type DeletePointCoordinateFields,
  useDeletePointState,
} from "hooks/zustand/tools/useDeletePointState";

function toCoordinateSetters(state: DeletePointCoordinateFields) {
  return {
    setLongitude: state.setLongitude,
    setLatitude: state.setLatitude,
    setXCoord: state.setXCoordinaat_rd,
    setYCoord: state.setYCoordinaat_rd,
  };
}

function applyRdCoordinatePatch(
  patch: CoordinateSyncPatch,
  state: DeletePointCoordinateFields
): void {
  applyCoordinateSyncPatchToSetters(
    { latitude: patch.latitude, longitude: patch.longitude },
    toCoordinateSetters(state)
  );
  state.setXCoordinaat_rd(state.xcoordinaat_rd);
  state.setYCoordinaat_rd(state.ycoordinaat_rd);
}

function applyWgs84CoordinatePatch(
  patch: CoordinateSyncPatch,
  state: DeletePointCoordinateFields
): void {
  applyCoordinateSyncPatchToSetters(
    { rdX: patch.rdX, rdY: patch.rdY },
    toCoordinateSetters(state)
  );
  state.setLatitude(state.latitude);
  state.setLongitude(state.longitude);
}

export function applyDeletePointCoordinatePatch(input: {
  coordinateSystem: string;
  patch: CoordinateSyncPatch;
}): void {
  const state = pickDeletePointCoordinateFields(useDeletePointState.getState());
  if (input.coordinateSystem === "RD") {
    applyRdCoordinatePatch(input.patch, state);
    return;
  }
  if (input.coordinateSystem === "WGS84") {
    applyWgs84CoordinatePatch(input.patch, state);
  }
}
