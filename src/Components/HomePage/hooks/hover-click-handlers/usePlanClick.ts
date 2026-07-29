import { useMapViewState } from "hooks/zustand/ui";
import { createPlanClickHandler } from "./planHoverClickHandlers";

export function usePlanClick() {
  const { graphicsLayer } = useMapViewState();
  return createPlanClickHandler(graphicsLayer);
}
