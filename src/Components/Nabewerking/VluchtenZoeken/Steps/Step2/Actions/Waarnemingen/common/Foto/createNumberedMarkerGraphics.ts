import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";

type MarkerAttributes = {
  imageIndex: number;
  displayNumber: number;
  attachmentId: number;
};

export function createNumberedMarkerGraphic(
  point: Point,
  attributes: MarkerAttributes
) {
  return new Graphic({
    geometry: point,
    symbol: new SimpleMarkerSymbol({
      color: [59, 130, 246, 0.9],
      size: 18,
      style: "circle",
      outline: { color: [255, 255, 255, 1], width: 1.5 },
    }),
    attributes: { ...attributes, type: "image-numbered-marker" },
  });
}

export function createNumberedMarkerLabelGraphic(
  point: Point,
  attributes: MarkerAttributes
) {
  return new Graphic({
    geometry: point,
    symbol: new TextSymbol({
      text: String(attributes.displayNumber),
      color: [255, 255, 255, 1],
      font: { size: 10, family: "Arial", weight: "bold" },
      haloColor: [59, 130, 246, 0.8],
      haloSize: 1,
      xoffset: 0,
      yoffset: 0,
    }),
    attributes: { ...attributes, type: "image-numbered-marker-label" },
  });
}
