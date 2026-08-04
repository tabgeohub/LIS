import { useMapViewState } from "hooks/zustand/ui";
import { useHoveredGraphicState } from "hooks/zustand/ui";
import { createPointHoverHandlers } from "./pointHoverHandlers";

export default function usePointHover() {
  const { mapView } = useMapViewState();
  return createPointHoverHandlers({
    mapView,
    setHovered: useHoveredGraphicState.getState().setHovered,
  });
}
