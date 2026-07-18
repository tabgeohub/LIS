import { useEffect } from "react";
import { syncTableTabGraphics } from "./syncTableTabGraphics";
import { buildSyncTableTabGraphicsArgs } from "./buildSyncTableTabGraphicsArgs";
import type { UseMapGraphicsInput } from "./useMapGraphicsTypes";

export type { UseMapGraphicsInput } from "./useMapGraphicsTypes";

export const useMapGraphics = (input: UseMapGraphicsInput) => {
  useEffect(() => {
    syncTableTabGraphics(buildSyncTableTabGraphicsArgs(input));
  }, [
    input.tab,
    input.pointsTable,
    input.geometriesTable,
    input.flightPlans,
    input.starredPoints,
    input.starredGeometries,
    input.starredPlans,
    input.graphicsLayer,
    input.graphicsLayerHover,
    input.yellowGraphicsLayer,
    input.mapView,
    input.originalGraphicsMap,
  ]);
};
