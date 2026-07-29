import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import { EnrichedPointType } from "Types";
import { YELLOW_MARKER_SYMBOL } from "@helpers/ArcGISHelpers/createSymbols";

export function createYellowCircle(
  selectedPointGraphicsLayer: __esri.GraphicsLayer,
  foundFeature: EnrichedPointType
) {
  const longitude = foundFeature.longitude;
  const latitude = foundFeature.latitude;

  const geometry = new Point({
    longitude: longitude,
    latitude: latitude,
  });

  const graphic = new Graphic({
    geometry,
    symbol: YELLOW_MARKER_SYMBOL,
  });

  selectedPointGraphicsLayer.add(graphic);
}
