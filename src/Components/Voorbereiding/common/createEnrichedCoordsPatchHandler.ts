import type { CoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";
import { applyCoordinateSyncPatchToSetters } from "@helpers/geo/applyCoordinateSyncPatchToSetters";
import type { CoordinateSyncPatchSetters } from "@helpers/geo/applyCoordinateSyncPatchToSetters";

export function createEnrichedCoordsPatchHandler(
  setters: CoordinateSyncPatchSetters
) {
  return (patch: CoordinateSyncPatch | null) =>
    applyCoordinateSyncPatchToSetters(patch, setters);
}
