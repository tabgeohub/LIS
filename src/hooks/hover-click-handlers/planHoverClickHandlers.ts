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
