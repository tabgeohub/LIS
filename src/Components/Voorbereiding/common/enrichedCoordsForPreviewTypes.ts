import type { CoordinateSyncPatchSetters } from "@helpers/geo/applyCoordinateSyncPatchToSetters";
import type { SpatialReference } from "Types";

export type EnrichedCoordsForPreview = CoordinateSyncPatchSetters & {
  xCoord: number;
  yCoord: number;
  latitude: number;
  longitude: number;
  coordinateSystem: SpatialReference | string;
};

export type EnrichedDrawCoords = {
  drawLon: number;
  drawLat: number;
};
