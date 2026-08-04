import type { CoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";
import type { EnrichedDrawCoords } from "./enrichedCoordsForPreviewTypes";

export function resolveDrawCoordsFromSyncPatch(
  fallback: EnrichedDrawCoords,
  patch: CoordinateSyncPatch | null
): EnrichedDrawCoords {
  return {
    drawLon: patch?.longitude ?? fallback.drawLon,
    drawLat: patch?.latitude ?? fallback.drawLat,
  };
}
