import { EnrichedPointType } from "Types";
import { createYellowMarkerGraphic } from "./pointMapGraphicFactories";
import { addStarPointGraphic } from "./starPointGraphicsActions";

export function syncPointsTableMapGraphics({
  points,
  starredPoints,
  yellowGraphicsLayer,
  graphicsLayer,
}: {
  points: EnrichedPointType[];
  starredPoints: EnrichedPointType[];
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  points.forEach((point) => {
    if (!point) return;

    yellowGraphicsLayer?.add(createYellowMarkerGraphic(point));

    const alreadyStarred = starredPoints.find((p) => p.id === point.id);
    if (alreadyStarred && graphicsLayer) {
      addStarPointGraphic(point, graphicsLayer);
    }
  });
}
