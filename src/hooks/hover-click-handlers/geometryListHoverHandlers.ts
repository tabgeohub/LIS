import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import {
  addGeometryHighlight,
  buildGeometryHoverState,
  GEOMETRY_HOVER_LABEL,
  HoverableGeometry,
  removeGeometryGraphicsByLabel,
} from "./geometryHoverGraphics";

type HoverSetter = (value: {
  id: number;
  label: string;
  point?: unknown;
} | null) => void;

export function createGeometryListHoverHandlers(input: {
  mapView: __esri.MapView | null | undefined;
  setHovered: HoverSetter;
}) {
  return {
    handleHoveredGeometry(geometry: HoverableGeometry | null | undefined) {
      if (!validateMapView(input.mapView) || !geometry) return;

      const graphic = addGeometryHighlight({
        mapView: input.mapView!,
        geometry,
        label: GEOMETRY_HOVER_LABEL,
      });

      if (graphic) {
        input.setHovered(buildGeometryHoverState(geometry));
      }
    },
    handleRemoveHoveredGeometry() {
      if (!validateMapView(input.mapView)) return;
      removeGeometryGraphicsByLabel(input.mapView!, GEOMETRY_HOVER_LABEL);
      input.setHovered(null);
    },
  };
}
