import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type MapView from "@arcgis/core/views/MapView";
import { getPointCoordinates, PointData } from "@helpers/ArcGISHelpers/createPointGraphic";

export const EDIT_GEOMETRY_VERTEX_LABEL = "edit-geometry-vertex";
export const EDIT_GEOMETRY_VERTEX_HOVER_LEGACY_LABEL = "edit-geometry-vertex-hover";
const symbol = (color: number[], size: number) => new SimpleMarkerSymbol({
  color, size, style: "circle", outline: { color: "white", width: 2 },
});
const VERTEX_SYMBOL = symbol([59, 130, 246, 0.95], 11);
const VERTEX_YELLOW_SYMBOL = symbol([255, 213, 0, 0.95], 12);

export function removeGeometryVertexGraphics(mapView: MapView) {
  const labels = new Set([
    EDIT_GEOMETRY_VERTEX_LABEL,
    EDIT_GEOMETRY_VERTEX_HOVER_LEGACY_LABEL,
  ]);
  mapView.graphics.toArray()
    .filter((graphic) => labels.has(graphic.attributes?.label))
    .forEach((graphic) => mapView.graphics.remove(graphic));
}

export function buildGeometryVertexGraphics(input: {
  points: PointData[];
  hoveredPointId: number | null;
  selectedPointId: number | null;
}) {
  return input.points.flatMap((point) => {
    const coords = getPointCoordinates(point, true);
    if (!coords) return [];
    const highlighted = point.id === input.hoveredPointId || point.id === input.selectedPointId;
    return [new Graphic({
      geometry: new Point({ ...coords, spatialReference: { wkid: 4326 } }),
      symbol: highlighted ? VERTEX_YELLOW_SYMBOL : VERTEX_SYMBOL,
      attributes: { label: EDIT_GEOMETRY_VERTEX_LABEL, pointId: point.id },
    })];
  });
}
