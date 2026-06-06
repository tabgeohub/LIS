import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  createPlanBoundingBoxGraphic,
  getFlightPlanPoints,
  PLAN_BOUNDING_BOX_SYMBOLS,
} from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";
import { FlightPlanType } from "Types";

export default function usePlanHover() {
  const { graphicsLayerHover } = useMapViewState();

  function handleHover(plan: FlightPlanType) {
    if (!graphicsLayerHover) return;

    const graphic = createPlanBoundingBoxGraphic(getFlightPlanPoints(plan), {
      symbolOptions: PLAN_BOUNDING_BOX_SYMBOLS.hover,
    });

    if (graphic) {
      graphicsLayerHover.add(graphic);
    }
  }

  function handleMouseLeave() {
    if (graphicsLayerHover) {
      graphicsLayerHover.removeAll();
    }
  }

  return {
    handleHover,
    handleMouseLeave,
  };
}
