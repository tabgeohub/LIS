import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import { EnrichedPointType } from "Types";
import { FinishedPointType } from "Types/finished_plans";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { YELLOW_MARKER_SYMBOL } from "@helpers/ArcGISHelpers/createSymbols";

type PointType = EnrichedPointType | FinishedPointType;

export function buildYellowMarkerGraphics(points: PointType[], selectedPointIds: number[]) {
  return selectedPointIds.flatMap((id) => {
    const point = points.find((candidate) => candidate.id === id);
    const coords = point && getPointCoordinates(point);
    if (!point || !coords) return [];
    return [new Graphic({
      geometry: new Point({ ...coords, spatialReference: { wkid: 4326 } }),
      symbol: YELLOW_MARKER_SYMBOL,
      attributes: point,
    })];
  });
}
