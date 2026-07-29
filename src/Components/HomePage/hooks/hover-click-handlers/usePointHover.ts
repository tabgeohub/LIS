import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useHoveredGraphicState } from "hooks/zustand/ui/hoveredGraphic";
import { createPointHoverHandlers } from "./pointHoverHandlers";

export default function usePointHover() {
  const { mapView } = useMapViewState();
  return createPointHoverHandlers({
    mapView,
    setHovered: useHoveredGraphicState.getState().setHovered,
  });
}
