import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { createGeometryListHoverHandlers } from "./geometryListHoverHandlers";

/** List-row hover outline for geometries on the map view. */
export default function useGeometryListHover() {
  const { mapView } = useMapViewState();
  return createGeometryListHoverHandlers({
    mapView,
    setHovered: useHoveredGraphicState.getState().setHovered,
  });
}
