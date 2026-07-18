import { useMapViewState } from "@helpers/ZustandStates/mapViewState";

export type MapHoverLayers = {
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  graphicsLayerHover: __esri.GraphicsLayer | null;
  selectedPointGraphicsLayer: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  geometriesGraphicsLayer: __esri.GraphicsLayer | null;
};

export function useMapHoverLayers(): MapHoverLayers {
  const s = useMapViewState();
  return {
    mapView: s.mapView,
    pointsGraphicsLayer: s.pointsGraphicsLayer,
    graphicsLayerHover: s.graphicsLayerHover,
    selectedPointGraphicsLayer: s.selectedPointGraphicsLayer,
    yellowGraphicsLayer: s.yellowGraphicsLayer,
    geometriesGraphicsLayer: s.geometriesGraphicsLayer,
  };
}
