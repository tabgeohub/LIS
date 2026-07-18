import type { CoordinateSyncPatch } from "./buildCoordinateSyncPatch";

export type CoordinateSyncPatchSetters = {
  setLongitude: (value: number) => void;
  setLatitude: (value: number) => void;
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
};

/** Applies an RD/WGS sync patch to coordinate setters. */
export function applyCoordinateSyncPatchToSetters(
  patch: CoordinateSyncPatch | null | undefined,
  setters: CoordinateSyncPatchSetters
): void {
  if (!patch) return;
  if (patch.longitude !== undefined) setters.setLongitude(patch.longitude);
  if (patch.latitude !== undefined) setters.setLatitude(patch.latitude);
  if (patch.rdX !== undefined) setters.setXCoord(patch.rdX);
  if (patch.rdY !== undefined) setters.setYCoord(patch.rdY);
}
