import { SpatialReference } from "Types";
import {
  buildCoordinateSyncPatch,
  type CoordinateSyncPatch,
} from "@helpers/geo/buildCoordinateSyncPatch";

export type CoordinateSystemSyncInput = {
  coordinateSystem: SpatialReference | string;
  rdX: number;
  rdY: number;
  latitude: number;
  longitude: number;
  patchCoords: (patch: CoordinateSyncPatch) => void;
};

/** Apply RD/WGS sync patch when the active coordinate system changes. */
export function applyCoordinateSystemSync(input: CoordinateSystemSyncInput) {
  const patch = buildCoordinateSyncPatch(input);
  if (patch) input.patchCoords(patch);
}
