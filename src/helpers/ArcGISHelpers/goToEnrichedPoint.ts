import MapView from "@arcgis/core/views/MapView";
import { EnrichedPointType } from "Types";
import { createPointGeometry } from "./pointMapGraphicFactories";

export function goToEnrichedPoint(
  mapView: MapView | null | undefined,
  point: EnrichedPointType
) {
  if (!mapView) return;
  mapView.goTo(createPointGeometry(point));
}
