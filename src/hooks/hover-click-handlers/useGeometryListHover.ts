import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import {
  addGeometryHighlight,
  buildGeometryHoverState,
  GEOMETRY_HOVER_LABEL,
  HoverableGeometry,
  removeGeometryGraphicsByLabel,
} from "./geometryHoverGraphics";

/** List-row hover outline for geometries on the map view. */
export default function useGeometryListHover() {
  const { mapView } = useMapViewState();
  const setHovered = useHoveredGraphicState.getState().setHovered;

  function handleHoveredGeometry(geometry: HoverableGeometry | null | undefined) {
    if (!validateMapView(mapView) || !geometry) return;

    const graphic = addGeometryHighlight({
      mapView: mapView!,
      geometry,
      label: GEOMETRY_HOVER_LABEL,
    });

    if (graphic) {
      setHovered(buildGeometryHoverState(geometry));
    }
  }

  function handleRemoveHoveredGeometry() {
    if (!validateMapView(mapView)) return;

    removeGeometryGraphicsByLabel(mapView!, GEOMETRY_HOVER_LABEL);
    setHovered(null);
  }

  return { handleHoveredGeometry, handleRemoveHoveredGeometry };
}
