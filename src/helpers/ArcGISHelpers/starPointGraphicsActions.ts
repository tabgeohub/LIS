import { EnrichedPointType } from "Types";
import { createStarPointGraphic } from "./pointMapGraphicFactories";

export function addStarPointGraphic(
  point: EnrichedPointType,
  layer: __esri.GraphicsLayer
) {
  layer.graphics.add(createStarPointGraphic(point));
}

export function removeStarPointGraphics(
  pointId: number | string,
  layer: __esri.GraphicsLayer
) {
  layer.graphics.removeMany(
    layer.graphics.filter((graphic) => graphic.attributes?.id === pointId)
  );
}

export function addStarPointGraphics(
  points: EnrichedPointType[],
  layer: __esri.GraphicsLayer
) {
  points.forEach((point) => addStarPointGraphic(point, layer));
}
