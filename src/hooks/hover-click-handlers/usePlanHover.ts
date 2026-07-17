import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createPlanHoverHandlers } from "./planHoverClickHandlers";

export default function usePlanHover() {
  const { graphicsLayerHover } = useMapViewState();
  return createPlanHoverHandlers(graphicsLayerHover);
}
