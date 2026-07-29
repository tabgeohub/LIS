import { useMapViewState } from "hooks/zustand/ui";
import { createPlanHoverHandlers } from "./planHoverClickHandlers";

export default function usePlanHover() {
  const { graphicsLayerHover } = useMapViewState();
  return createPlanHoverHandlers(graphicsLayerHover);
}
