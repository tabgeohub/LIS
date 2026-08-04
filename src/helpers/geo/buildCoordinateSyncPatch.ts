import { buildRdCoordinateSyncPatch } from "./buildRdCoordinateSyncPatch";
import { buildWgs84CoordinateSyncPatch } from "./buildWgs84CoordinateSyncPatch";
import type {
  CoordinateSyncPatch,
  CoordinateSyncPatchInput,
} from "./coordinateSyncPatchTypes";

export type { CoordinateSyncPatch } from "./coordinateSyncPatchTypes";

export function buildCoordinateSyncPatch(
  input: CoordinateSyncPatchInput
): CoordinateSyncPatch | null {
  if (input.coordinateSystem === "RD") {
    return buildRdCoordinateSyncPatch(input);
  }

  if (input.coordinateSystem === "WGS84") {
    return buildWgs84CoordinateSyncPatch(input);
  }

  return null;
}
