import { FlightPlanType } from "Types";
import { showPlanSearchListHover } from "./showPlanSearchListHoverBody";
import {
  resolveOriginalPlanGraphic,
  type OriginalGraphicsMapRef,
} from "./resolveOriginalPlanGraphic";

export type { OriginalGraphicsMapRef };

/** Resolve original graphic from a map keyed by plan id (number or string). */
export function hoverFlightPlanFromOriginalMap(input: {
  plan: FlightPlanType;
  mapView: __esri.MapView | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  originalGraphicsMap: OriginalGraphicsMapRef;
}): void {
  showPlanSearchListHover({
    plan: input.plan,
    mapView: input.mapView,
    graphicsLayerHover: input.graphicsLayerHover,
    graphicsLayer: input.graphicsLayer,
    originalGraphic: resolveOriginalPlanGraphic(input),
  });
}

/** Bind map layers once; returns a per-plan hover handler (table + list). */
export function createHoverFlightPlanFromOriginalMap(input: {
  mapView: __esri.MapView | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  originalGraphicsMap: OriginalGraphicsMapRef;
}): (plan: FlightPlanType) => void {
  return (plan) =>
    hoverFlightPlanFromOriginalMap({
      plan,
      mapView: input.mapView,
      graphicsLayerHover: input.graphicsLayerHover,
      graphicsLayer: input.graphicsLayer,
      originalGraphicsMap: input.originalGraphicsMap,
    });
}
