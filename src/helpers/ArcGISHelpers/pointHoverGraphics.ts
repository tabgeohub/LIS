import { createPin } from "./createPin";
import type { EnrichedPointType } from "Types";

export const POINT_HOVER_LABEL = "hovered-point";

export function clearPointHoverGraphic(mapView: __esri.MapView) {
  mapView.graphics
    .toArray()
    .filter((graphic) => graphic.attributes?.label === POINT_HOVER_LABEL)
    .forEach((graphic) => mapView.graphics.remove(graphic));
}

export function replacePointHoverGraphic(
  mapView: __esri.MapView,
  point: EnrichedPointType
) {
  clearPointHoverGraphic(mapView);
  createPin({ point, mapView, label: POINT_HOVER_LABEL });
}
