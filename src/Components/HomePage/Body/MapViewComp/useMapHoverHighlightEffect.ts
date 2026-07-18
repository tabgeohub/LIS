/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { subscribeMapHoverHighlight } from "./subscribeMapHoverHighlight";
import type { MapHoverLayers } from "./useMapHoverLayers";

export function useMapHoverHighlightEffect(layers: MapHoverLayers) {
  useEffect(() => {
    if (!layers.mapView) return;
    return subscribeMapHoverHighlight(layers);
  }, [
    layers.mapView,
    layers.pointsGraphicsLayer,
    layers.graphicsLayerHover,
    layers.selectedPointGraphicsLayer,
    layers.yellowGraphicsLayer,
    layers.geometriesGraphicsLayer,
  ]);
}
