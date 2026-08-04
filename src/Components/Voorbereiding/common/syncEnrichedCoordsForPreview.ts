import { buildCoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";
import { applyCoordinateSyncPatchToSetters } from "@helpers/geo/applyCoordinateSyncPatchToSetters";
import type {
  EnrichedCoordsForPreview,
  EnrichedDrawCoords,
} from "./enrichedCoordsForPreviewTypes";
import { resolveDrawCoordsFromSyncPatch } from "./resolveDrawCoordsFromSyncPatch";

/** Sync RD/WGS fields and return WGS draw coordinates for enriched add-point Step 2. */
export function syncEnrichedCoordsForPreview(
  coords: EnrichedCoordsForPreview
): EnrichedDrawCoords {
  const patch = buildCoordinateSyncPatch({
    coordinateSystem: coords.coordinateSystem,
    rdX: coords.xCoord,
    rdY: coords.yCoord,
    latitude: coords.latitude,
    longitude: coords.longitude,
  });

  applyCoordinateSyncPatchToSetters(patch, coords);

  return resolveDrawCoordsFromSyncPatch(
    { drawLon: coords.longitude, drawLat: coords.latitude },
    patch
  );
}
