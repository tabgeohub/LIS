import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { createPlanHoverHandlers } from "./planHoverClickHandlers";

export default function usePlanHover() {
  const { graphicsLayerHover } = useMapViewState();
  return createPlanHoverHandlers(graphicsLayerHover);
}
