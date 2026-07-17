import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createPlanClickHandler } from "./planHoverClickHandlers";

export function usePlanClick() {
  const { graphicsLayer } = useMapViewState();
  return createPlanClickHandler(graphicsLayer);
}
