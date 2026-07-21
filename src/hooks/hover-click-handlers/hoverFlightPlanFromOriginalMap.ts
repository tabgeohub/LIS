import { FlightPlanType } from "Types";
import { showPlanSearchListHover } from "./showPlanSearchListHoverBody";

export type OriginalGraphicsMapRef = {
  current: Map<number, __esri.Graphic> | Map<string, __esri.Graphic>;
};

/** Resolve original graphic from a map keyed by plan id (number or string). */
export function hoverFlightPlanFromOriginalMap(input: {
  plan: FlightPlanType;
  mapView: __esri.MapView | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  originalGraphicsMap: OriginalGraphicsMapRef;
}): void {
  const map = input.originalGraphicsMap.current as Map<
    string | number,
    __esri.Graphic
  >;
  const originalGraphic =
    map.get(input.plan.id) ?? map.get(String(input.plan.id));

  showPlanSearchListHover({
    plan: input.plan,
    mapView: input.mapView,
    graphicsLayerHover: input.graphicsLayerHover,
    graphicsLayer: input.graphicsLayer,
    originalGraphic,
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
