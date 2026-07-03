import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { PathPoint } from "./pathPlanUtils";

const SELECTED_PATH_ATTR = "selected-path-point";

export function clearSelectedPathHighlights(layer: __esri.GraphicsLayer) {
  layer.graphics.removeMany(
    layer.graphics.filter((g) => g.attributes?.title === SELECTED_PATH_ATTR)
  );
}

export function addSelectedPathHighlight(
  layer: __esri.GraphicsLayer,
  point: PathPoint
) {
  clearSelectedPathHighlights(layer);
  layer.add(
    new Graphic({
      geometry: new Point({
        longitude: point.longitude,
        latitude: point.latitude,
      }),
      symbol: new SimpleMarkerSymbol({
        color: "blue",
        outline: { color: "black", width: 0.5 },
        size: "8px",
      }),
      attributes: { title: SELECTED_PATH_ATTR },
    })
  );
}
