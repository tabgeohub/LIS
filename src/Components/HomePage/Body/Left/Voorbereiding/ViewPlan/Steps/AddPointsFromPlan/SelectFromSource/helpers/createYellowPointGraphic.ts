import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { createYellowWgs84PointGraphic } from "Components/HomePage/helpers/ArcGISHelpers/createYellowWgs84PointGraphic";
import { EnrichedPointType } from "Types";
import { SelectFromSourceItemPoint } from "./mapSourceItems";

export function createYellowPointGraphic(point: SelectFromSourceItemPoint) {
  const coords = getPointCoordinates(point as EnrichedPointType);
  if (!coords) return null;

  return createYellowWgs84PointGraphic({
    longitude: coords.longitude,
    latitude: coords.latitude,
    attributes: point,
  });
}
