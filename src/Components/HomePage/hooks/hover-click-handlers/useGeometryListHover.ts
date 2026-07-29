import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useHoveredGraphicState } from "hooks/zustand/ui/hoveredGraphic";
import { createGeometryListHoverHandlers } from "./geometryListHoverHandlers";

/** List-row hover outline for geometries on the map view. */
export default function useGeometryListHover() {
  const { mapView } = useMapViewState();
  return createGeometryListHoverHandlers({
    mapView,
    setHovered: useHoveredGraphicState.getState().setHovered,
  });
}
