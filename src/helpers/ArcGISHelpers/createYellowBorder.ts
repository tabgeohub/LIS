import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { EnrichedPointType } from "Types";

export default function createYellowBorder(point: EnrichedPointType) {
  const geometry = new Point({
    longitude: point.longitude,
    latitude: point.latitude,
    spatialReference: { wkid: 4326 },
  });

  const outerSymbol = new SimpleMarkerSymbol({
    style: "circle",
    color: [255, 255, 0, 0],
    size: 16,
    outline: {
      color: "yellow",
      width: 2,
    },
  });

  const outerGraphic = new Graphic({
    geometry,
    symbol: outerSymbol,
  });

  return outerGraphic;
}
