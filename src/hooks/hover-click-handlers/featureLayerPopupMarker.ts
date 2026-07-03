import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

export function createFeatureLayerMarker(input: {
  redGraphicsLayer: __esri.GraphicsLayer;
  geometry: __esri.Point;
  existingMarker: __esri.Graphic | null;
}): __esri.Graphic {
  if (input.existingMarker) {
    input.redGraphicsLayer.remove(input.existingMarker);
  }

  const marker = new Graphic({
    geometry: input.geometry,
    symbol: new SimpleMarkerSymbol({
      color: [0, 0, 0, 0],
      size: 12,
      style: "circle",
      outline: { color: [255, 255, 255, 1], width: 2 },
    }),
    attributes: { type: "feature-layer-marker" },
  });

  input.redGraphicsLayer.add(marker);
  return marker;
}

export function clearFeatureLayerMarker(input: {
  redGraphicsLayer?: __esri.GraphicsLayer | null;
  marker: __esri.Graphic | null;
}) {
  if (input.marker && input.redGraphicsLayer) {
    input.redGraphicsLayer.remove(input.marker);
  }
}
