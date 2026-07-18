import type { UseMapGraphicsInput } from "./useMapGraphicsTypes";

export function buildSyncTableTabGraphicsArgs(input: UseMapGraphicsInput) {
  return {
    tab: input.tab,
    ctx: {
      graphicsLayer: input.graphicsLayer,
      yellowGraphicsLayer: input.yellowGraphicsLayer,
      mapView: input.mapView,
      originalGraphicsMap: input.originalGraphicsMap,
    },
    pointsTable: input.pointsTable,
    geometriesTable: input.geometriesTable,
    flightPlans: input.flightPlans,
    starredPoints: input.starredPoints,
    starredGeometries: input.starredGeometries,
    starredPlans: input.starredPlans,
  };
}
