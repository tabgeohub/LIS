import type { CoordinateSyncPatch } from "./buildCoordinateSyncPatch";

export type CoordinateSyncPatchSetters = {
  setLongitude: (value: number) => void;
  setLatitude: (value: number) => void;
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
};

type PatchField = {
  value: number | undefined;
  set: (value: number) => void;
};

function applyDefinedPatchFields(fields: PatchField[]): void {
  for (const field of fields) {
    if (field.value !== undefined) field.set(field.value);
  }
}

/** Applies an RD/WGS sync patch to coordinate setters. */
export function applyCoordinateSyncPatchToSetters(
  patch: CoordinateSyncPatch | null | undefined,
  setters: CoordinateSyncPatchSetters
): void {
  if (!patch) return;
  applyDefinedPatchFields([
    { value: patch.longitude, set: setters.setLongitude },
    { value: patch.latitude, set: setters.setLatitude },
    { value: patch.rdX, set: setters.setXCoord },
    { value: patch.rdY, set: setters.setYCoord },
  ]);
}
