import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type { EnrichedPointType } from "Types";

const BLUE_POINT_SYMBOL = new SimpleMarkerSymbol({
  color: "blue",
  size: 12,
  style: "circle",
  outline: { color: "white", width: 1 },
});

export function buildPointMapGraphics(points: EnrichedPointType[]) {
  return points.map(
    (point) =>
      new Graphic({
        geometry: new Point({ x: point.longitude, y: point.latitude }),
        symbol: BLUE_POINT_SYMBOL,
        attributes: point,
      })
  );
}
