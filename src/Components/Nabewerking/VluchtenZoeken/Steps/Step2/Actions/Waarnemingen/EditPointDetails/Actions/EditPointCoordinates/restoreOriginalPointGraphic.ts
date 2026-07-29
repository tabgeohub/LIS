import Point from "@arcgis/core/geometry/Point";
import type { FinishedPointType } from "Types/finished_plans";
import {
  findGraphicByPointId,
  replacePointGraphic,
} from "./pointMapGraphicHelpers";

export function restoreOriginalPointGraphic(input: {
  pointsGraphicsLayer: __esri.GraphicsLayer;
  point: FinishedPointType;
  longitude: number;
  latitude: number;
}) {
  const preview = findGraphicByPointId(input.pointsGraphicsLayer, input.point.id);
  const previewLon = (preview?.geometry as Point | undefined)?.longitude;
  if (!preview || previewLon === input.longitude) return;

  input.pointsGraphicsLayer.remove(preview);
  replacePointGraphic({
    layer: input.pointsGraphicsLayer,
    point: input.point,
    longitude: input.longitude,
    latitude: input.latitude,
  });
}
