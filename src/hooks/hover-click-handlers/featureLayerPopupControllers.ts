import type { MutableRefObject } from "react";
import {
  clearFeatureLayerMarker,
  createFeatureLayerMarker,
} from "./featureLayerPopupMarker";

export function createFeatureLayerPopupMarkerControllers(input: {
  redGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  markerGraphicRef: MutableRefObject<__esri.Graphic | null>;
}) {
  const clearMarker = () => {
    clearFeatureLayerMarker({
      redGraphicsLayer: input.redGraphicsLayer,
      marker: input.markerGraphicRef.current,
    });
    input.markerGraphicRef.current = null;
  };

  const createMarker = (geometry: __esri.Point) => {
    if (!input.redGraphicsLayer) return;
    input.markerGraphicRef.current = createFeatureLayerMarker({
      redGraphicsLayer: input.redGraphicsLayer,
      geometry,
      existingMarker: input.markerGraphicRef.current,
    });
  };

  return { clearMarker, createMarker };
}
