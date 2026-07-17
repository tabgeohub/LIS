import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { createPointHoverHandlers } from "./pointHoverHandlers";

export default function usePointHover() {
  const { mapView } = useMapViewState();
  return createPointHoverHandlers({
    mapView,
    setHovered: useHoveredGraphicState.getState().setHovered,
  });
}
