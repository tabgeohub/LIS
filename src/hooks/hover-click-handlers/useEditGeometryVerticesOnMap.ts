import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { PointData } from "@helpers/ArcGISHelpers/createPointGraphic";
import {
  buildGeometryVertexGraphics,
  EDIT_GEOMETRY_VERTEX_LABEL,
  removeGeometryVertexGraphics,
} from "./geometryVertexGraphics";

export { EDIT_GEOMETRY_VERTEX_LABEL } from "./geometryVertexGraphics";

export default function useEditGeometryVerticesOnMap(input: {
  showVertices: boolean;
  points: PointData[];
  hoveredPointId: number | null;
  selectedPointId: number | null;
}) {
  const { mapView } = useMapViewState();
  useEffect(() => {
    if (!mapView) return;
    removeGeometryVertexGraphics(mapView);
    if (!input.showVertices) return;
    mapView.graphics.addMany(buildGeometryVertexGraphics(input));
    return () => removeGeometryVertexGraphics(mapView);
  }, [
    mapView,
    input.showVertices,
    input.points,
    input.hoveredPointId,
    input.selectedPointId,
  ]);
}
