import type { MapViewState } from "./mapViewStateTypes";

export function createMapViewExtraLayersSlice(
  set: (partial: Partial<MapViewState>) => void
) {
  return {
    redGraphicsLayer: null as __esri.GraphicsLayer | null,
    setRedGraphicsLayer: (redGraphicsLayer: __esri.GraphicsLayer) =>
      set({ redGraphicsLayer }),
    selectedPointGraphicsLayer: null as __esri.GraphicsLayer | null,
    setSelectedPointGraphicsLayer: (
      selectedPointGraphicsLayer: __esri.GraphicsLayer | null
    ) => set({ selectedPointGraphicsLayer }),
    geometriesGraphicsLayer: null as __esri.GraphicsLayer | null,
    setGeometriesGraphicsLayer: (
      geometriesGraphicsLayer: __esri.GraphicsLayer | null
    ) => set({ geometriesGraphicsLayer }),
  };
}
