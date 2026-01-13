import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { EnrichedPointType } from "Types";

export function createYellowCircle(
  selectedPointGraphicsLayer: __esri.GraphicsLayer,
  foundFeature: EnrichedPointType
) {
  const longitude = foundFeature.longitude;
  const latitude = foundFeature.latitude;

  const yellow = new SimpleMarkerSymbol({
    color: "yellow",
    size: 12,
    style: "circle",
    outline: {
      color: "white",
      width: 1,
    },
  });

  const geometry = new Point({
    longitude: longitude,
    latitude: latitude,
  });

  const graphic = new Graphic({
    geometry,
    symbol: yellow,
  });

  selectedPointGraphicsLayer.add(graphic);
}
