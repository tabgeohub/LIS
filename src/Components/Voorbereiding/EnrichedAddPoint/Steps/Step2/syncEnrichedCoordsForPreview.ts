import { buildCoordinateSyncPatch } from "@helpers/geo/buildCoordinateSyncPatch";
import {
  applyCoordinateSyncPatchToSetters,
  type CoordinateSyncPatchSetters,
} from "@helpers/geo/applyCoordinateSyncPatchToSetters";
import type { SpatialReference } from "Types";

type EnrichedCoordsForPreview = CoordinateSyncPatchSetters & {
  xCoord: number;
  yCoord: number;
  latitude: number;
  longitude: number;
  coordinateSystem: SpatialReference | string;
};

/** Sync RD/WGS fields and return WGS draw coordinates for enriched add-point Step 2. */
export function syncEnrichedCoordsForPreview(coords: EnrichedCoordsForPreview): {
  drawLon: number;
  drawLat: number;
} {
  let drawLon = coords.longitude;
  let drawLat = coords.latitude;

  const patch = buildCoordinateSyncPatch({
    coordinateSystem: coords.coordinateSystem,
    rdX: coords.xCoord,
    rdY: coords.yCoord,
    latitude: coords.latitude,
    longitude: coords.longitude,
  });
  if (patch?.longitude !== undefined) drawLon = patch.longitude;
  if (patch?.latitude !== undefined) drawLat = patch.latitude;
  applyCoordinateSyncPatchToSetters(patch, coords);

  return { drawLon, drawLat };
}
