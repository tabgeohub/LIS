import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import {
  addGeometryHighlight,
  GEOMETRY_EDIT_HIGHLIGHT_LABEL,
  HoverableGeometry,
  removeGeometryGraphicsByLabel,
} from "./geometryHoverGraphics";

/** Non-hook handlers for yellow edit-form geometry outline. */
export function createGeometryEditHighlightHandlers(
  mapView: __esri.MapView | null | undefined
) {
  return {
    addEditGeometryHighlight(geometry: HoverableGeometry | null | undefined) {
      if (!validateMapView(mapView) || !geometry) return;
      addGeometryHighlight({
        mapView: mapView!,
        geometry,
        label: GEOMETRY_EDIT_HIGHLIGHT_LABEL,
      });
    },
    removeEditGeometryHighlight() {
      if (!validateMapView(mapView)) return;
      removeGeometryGraphicsByLabel(mapView!, GEOMETRY_EDIT_HIGHLIGHT_LABEL);
    },
  };
}
