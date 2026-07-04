import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Graphic from "@arcgis/core/Graphic";
import type { FinishedPointType } from "Types/finished_plans";

export function addPointReportGraphic(
  tempLayer: __esri.GraphicsLayer,
  point: FinishedPointType
) {
  const graphic = new Graphic({
    geometry: new Point({
      latitude: point.latitude,
      longitude: point.longitude,
    }),
    symbol: new SimpleMarkerSymbol({
      color: [255, 140, 0, 1],
      size: 10,
      outline: { color: [0, 0, 0, 1], width: 1 },
    }),
  });
  tempLayer.removeAll();
  tempLayer.add(graphic);
}
