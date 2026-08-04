import { createQuadrantGraphic } from "helpers/ArcGISHelpers/createQuadrantGraphic";
import type { EnrichedPointType } from "Types";

export function syncHoverQuadrantGraphics(input: {
  graphicsLayerHover: __esri.GraphicsLayer;
  hoveredPoints: EnrichedPointType[] | null | undefined;
}): void {
  input.graphicsLayerHover.removeAll();
  input.hoveredPoints?.forEach(() => {
    input.graphicsLayerHover.add(
      createQuadrantGraphic(input.hoveredPoints ?? [])
    );
  });
}

export function syncSelectedQuadrantGraphics(input: {
  graphicsLayer: __esri.GraphicsLayer | null;
  graphicsLayerHover: __esri.GraphicsLayer;
  hoveredPoints: EnrichedPointType[] | null | undefined;
}): void {
  input.graphicsLayerHover.removeAll();
  input.graphicsLayer?.removeAll();
  input.hoveredPoints?.forEach(() => {
    input.graphicsLayer?.add(createQuadrantGraphic(input.hoveredPoints ?? []));
  });
}
