import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import MapView from "@arcgis/core/views/MapView";

export const CURRENTLY_DRAWING_ATTRIBUTE = "currently-drawing";

export function clearCurrentlyDrawingGraphics(
  mapView: MapView | null | undefined
) {
  if (!mapView?.map) return;

  const layers = mapView.map.layers;
  for (let i = 0; i < layers.length; i++) {
    const layer = layers.getItemAt(i);
    if (!(layer instanceof GraphicsLayer)) continue;

    const graphics = layer.graphics.toArray();
    graphics.forEach((graphic) => {
      if (graphic.attributes?.[CURRENTLY_DRAWING_ATTRIBUTE] === true) {
        try {
          layer.remove(graphic);
        } catch {
          // Ignore removal errors
        }
      }
    });
  }
}

export function resetMapCursor(mapView: MapView | null | undefined) {
  if (mapView?.container) {
    mapView.container.style.cursor = "";
  }
}

export function cleanupDrawingToolMap(mapView: MapView | null | undefined) {
  clearCurrentlyDrawingGraphics(mapView);
  resetMapCursor(mapView);
}
