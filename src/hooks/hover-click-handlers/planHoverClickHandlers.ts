import {
  createPlanBoundingBoxGraphic,
  getFlightPlanPoints,
  PLAN_BOUNDING_BOX_SYMBOLS,
} from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";
import { FlightPlanType } from "Types";

export function createPlanHoverHandlers(
  graphicsLayerHover: __esri.GraphicsLayer | null | undefined
) {
  return {
    handleHover(plan: FlightPlanType) {
      if (!graphicsLayerHover) return;
      const graphic = createPlanBoundingBoxGraphic(getFlightPlanPoints(plan), {
        symbolOptions: PLAN_BOUNDING_BOX_SYMBOLS.hover,
      });
      if (graphic) graphicsLayerHover.add(graphic);
    },
    handleMouseLeave() {
      graphicsLayerHover?.removeAll();
    },
  };
}

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

export function createPlanClickHandler(
  graphicsLayer: __esri.GraphicsLayer | null | undefined
) {
  return {
    handleClick(
      plan: FlightPlanType,
      setSelectedPlan: (value: FlightPlanType | null) => void
    ) {
      if (!graphicsLayer) return;
      setSelectedPlan(plan);
      graphicsLayer.removeAll();
      const graphic = createPlanBoundingBoxGraphic(getFlightPlanPoints(plan), {
        symbolOptions: PLAN_BOUNDING_BOX_SYMBOLS.click,
      });
      if (graphic) graphicsLayer.add(graphic);
    },
  };
}
