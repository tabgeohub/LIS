import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { createMapPointerHoverHandler } from "./mapPointerHoverHandler";
import type { MapHoverLayers } from "./useMapHoverLayers";

export function subscribeMapHoverHighlight(input: MapHoverLayers) {
  if (!input.mapView) return () => {};
  const includeLayers = [
    input.pointsGraphicsLayer,
    input.selectedPointGraphicsLayer,
    input.yellowGraphicsLayer,
    input.geometriesGraphicsLayer,
  ].filter(Boolean) as (__esri.Layer | __esri.GraphicsLayer)[];
  const { setHovered } = useHoveredGraphicState.getState();
  const pointerHandle = input.mapView.on(
    "pointer-move",
    createMapPointerHoverHandler({
      mapView: input.mapView,
      includeLayers,
      graphicsLayerHover: input.graphicsLayerHover,
      setHovered,
    })
  );
  return () => {
    pointerHandle.remove();
    input.graphicsLayerHover?.removeAll();
    setHovered(null);
  };
}
