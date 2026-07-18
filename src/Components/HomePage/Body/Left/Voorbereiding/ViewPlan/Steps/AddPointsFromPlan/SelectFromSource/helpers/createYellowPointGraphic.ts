import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { EnrichedPointType } from "Types";
import { SelectFromSourceItemPoint } from "./mapSourceItems";

export function createYellowPointGraphic(point: SelectFromSourceItemPoint) {
  const coords = getPointCoordinates(point as EnrichedPointType);
  if (!coords) return null;

  const yellow = new SimpleMarkerSymbol({
    color: "yellow",
    size: 12,
    style: "circle",
    outline: { color: "white", width: 1 },
  });

  return new Graphic({
    geometry: new Point({
      longitude: coords.longitude,
      latitude: coords.latitude,
      spatialReference: { wkid: 4326 },
    }),
    symbol: yellow,
    attributes: point,
  });
}
