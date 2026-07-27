import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import MapView from "@arcgis/core/views/MapView";

export const CURRENTLY_DRAWING_ATTRIBUTE = "currently-drawing";

function isCurrentlyDrawingGraphic(graphic: __esri.Graphic): boolean {
  return graphic.attributes?.[CURRENTLY_DRAWING_ATTRIBUTE] === true;
}

function removeCurrentlyDrawingFromLayer(layer: GraphicsLayer) {
  layer.graphics.toArray().forEach((graphic) => {
    if (!isCurrentlyDrawingGraphic(graphic)) return;
    try {
      layer.remove(graphic);
    } catch {
      // Ignore removal errors
    }
  });
}

function graphicsLayersOf(mapView: MapView): GraphicsLayer[] {
  const layers = mapView.map.layers;
  const result: GraphicsLayer[] = [];
  for (let i = 0; i < layers.length; i++) {
    const layer = layers.getItemAt(i);
    if (layer instanceof GraphicsLayer) {
      result.push(layer);
    }
  }
  return result;
}

export function clearCurrentlyDrawingGraphics(
  mapView: MapView | null | undefined
) {
  if (!mapView?.map) return;
  graphicsLayersOf(mapView).forEach(removeCurrentlyDrawingFromLayer);
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
