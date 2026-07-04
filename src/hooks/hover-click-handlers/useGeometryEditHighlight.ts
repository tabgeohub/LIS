import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import {
  addGeometryHighlight,
  GEOMETRY_EDIT_HIGHLIGHT_LABEL,
  HoverableGeometry,
  removeGeometryGraphicsByLabel,
} from "./geometryHoverGraphics";

/** Yellow outline for the geometry open in an edit form (not list hover). */
export default function useGeometryEditHighlight() {
  const { mapView } = useMapViewState();

  function addEditGeometryHighlight(geometry: HoverableGeometry | null | undefined) {
    if (!validateMapView(mapView) || !geometry) return;

    addGeometryHighlight({
      mapView: mapView!,
      geometry,
      label: GEOMETRY_EDIT_HIGHLIGHT_LABEL,
    });
  }

  function removeEditGeometryHighlight() {
    if (!validateMapView(mapView)) return;

    removeGeometryGraphicsByLabel(mapView!, GEOMETRY_EDIT_HIGHLIGHT_LABEL);
  }

  return { addEditGeometryHighlight, removeEditGeometryHighlight };
}
