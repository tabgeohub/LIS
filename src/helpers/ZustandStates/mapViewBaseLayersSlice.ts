import type { MapViewState } from "./mapViewStateTypes";

export function createMapViewBaseLayersSlice(
  set: (partial: Partial<MapViewState>) => void
) {
  return {
    pointsGraphicsLayer: null as __esri.GraphicsLayer | null,
    setPointsGraphicsLayer: (pointsGraphicsLayer: __esri.GraphicsLayer) =>
      set({ pointsGraphicsLayer }),
    graphicsLayer: null as __esri.GraphicsLayer | null,
    setGraphicsLayer: (graphicsLayer: __esri.GraphicsLayer | null) =>
      set({ graphicsLayer }),
    graphicsLayerHover: null as __esri.GraphicsLayer | null,
    setGraphicsLayerHover: (graphicsLayerHover: __esri.GraphicsLayer | null) =>
      set({ graphicsLayerHover }),
    yellowGraphicsLayer: null as __esri.GraphicsLayer | null,
    setYellowGraphicsLayer: (yellowGraphicsLayer: __esri.GraphicsLayer) =>
      set({ yellowGraphicsLayer }),
    yellowGeometriesGraphicsLayer: null as __esri.GraphicsLayer | null,
    setYellowGeometriesGraphicsLayer: (
      yellowGeometriesGraphicsLayer: __esri.GraphicsLayer
    ) => set({ yellowGeometriesGraphicsLayer }),
  };
}
