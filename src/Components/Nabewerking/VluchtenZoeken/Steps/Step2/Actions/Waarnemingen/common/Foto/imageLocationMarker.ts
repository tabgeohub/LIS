import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export function createImageLocationMarker(point: Point) {
  return new Graphic({
    geometry: point,
    symbol: new SimpleMarkerSymbol({
      color: [255, 0, 0, 0.8],
      size: 16,
      style: "circle",
      outline: { color: [255, 255, 255, 1], width: 2 },
    }),
    attributes: { type: "image-location-marker" },
  });
}

export function replaceImageLocationMarker(
  redGraphicsLayer: GraphicsLayer,
  point: Point
) {
  redGraphicsLayer.graphics
    .toArray()
    .filter((g) => g.attributes?.type === "image-location-marker")
    .forEach((g) => redGraphicsLayer.remove(g));
  const marker = createImageLocationMarker(point);
  redGraphicsLayer.add(marker);
  setTimeout(() => redGraphicsLayer.remove(marker), 5000);
}
