import {
  createPlanBoundingBoxGraphic,
  getFlightPlanPoints,
  PLAN_BOUNDING_BOX_SYMBOLS,
} from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";
import { FlightPlanType } from "Types";

/** Hover highlight used by FlightPlansTable + searched FlightPlansList. */
export function showPlanSearchListHover(input: {
  plan: FlightPlanType;
  mapView: __esri.MapView | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  originalGraphic: __esri.Graphic | undefined;
}) {
  if (!input.mapView || !input.graphicsLayerHover || !input.graphicsLayer) {
    return;
  }
  if (input.originalGraphic) {
    input.graphicsLayer.remove(input.originalGraphic);
  }
  input.graphicsLayerHover.removeAll();
  const hoverGraphic = createPlanBoundingBoxGraphic(
    getFlightPlanPoints(input.plan),
    { symbolOptions: PLAN_BOUNDING_BOX_SYMBOLS.hoverSearchList }
  );
  if (hoverGraphic) {
    input.graphicsLayerHover.add(hoverGraphic);
  }
}

/** Resolve original graphic from a map keyed by plan id (number or string). */
export function hoverFlightPlanFromOriginalMap(input: {
  plan: FlightPlanType;
  mapView: __esri.MapView | null | undefined;
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  originalGraphicsMap: {
    current: Map<number, __esri.Graphic> | Map<string, __esri.Graphic>;
  };
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
