import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  createPlanBoundingBoxGraphic,
  getFlightPlanPoints,
  PLAN_BOUNDING_BOX_SYMBOLS,
} from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";
import { FlightPlanType } from "Types";

export function usePlanClick() {
  const { graphicsLayer } = useMapViewState();

  function handleClick(
    plan: FlightPlanType,
    setSelectedPlan: (value: FlightPlanType | null) => void
  ) {
    if (!graphicsLayer) return;

    setSelectedPlan(plan);
    graphicsLayer.removeAll();

    const graphic = createPlanBoundingBoxGraphic(getFlightPlanPoints(plan), {
      symbolOptions: PLAN_BOUNDING_BOX_SYMBOLS.click,
    });

    if (graphic) {
      graphicsLayer.add(graphic);
    }
  }

  return {
    handleClick,
  };
}
