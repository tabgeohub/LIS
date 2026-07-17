import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createGeometryEditHighlightHandlers } from "./geometryEditHighlightHandlers";

/** Yellow outline for the geometry open in an edit form (not list hover). */
export default function useGeometryEditHighlight() {
  const { mapView } = useMapViewState();
  return createGeometryEditHighlightHandlers(mapView);
}
