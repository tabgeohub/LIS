import { useEffect } from "react";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import type MapView from "@arcgis/core/views/MapView";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { getPointCoordinates, PointData } from "@helpers/ArcGISHelpers/createPointGraphic";

export const EDIT_GEOMETRY_VERTEX_LABEL = "edit-geometry-vertex";
const EDIT_GEOMETRY_VERTEX_HOVER_LEGACY_LABEL =
  "edit-geometry-vertex-hover";

const VERTEX_SYMBOL = new SimpleMarkerSymbol({
  color: [59, 130, 246, 0.95],
  size: 11,
  style: "circle",
  outline: { color: "white", width: 2 },
});

const VERTEX_YELLOW_SYMBOL = new SimpleMarkerSymbol({
  color: [255, 213, 0, 0.95],
  size: 12,
  style: "circle",
  outline: { color: "white", width: 2 },
});

function removeGraphicsByLabel(mapView: MapView, label: string) {
  mapView.graphics
    .toArray()
    .filter((g) => g.attributes?.label === label)
    .forEach((g) => mapView.graphics.remove(g));
}

/**
 * Draws geometry vertex markers on the map while editing points.
 * Hover/click recolors the marker itself (no extra hover circle).
 */
export default function useEditGeometryVerticesOnMap({
  showVertices,
  points,
  hoveredPointId,
  selectedPointId,
}: {
  showVertices: boolean;
  points: PointData[];
  hoveredPointId: number | null;
  selectedPointId: number | null;
}) {
  const { mapView } = useMapViewState();

  useEffect(() => {
    if (!validateMapView(mapView)) return;

    removeGraphicsByLabel(mapView, EDIT_GEOMETRY_VERTEX_LABEL);
    // Legacy cleanup: previous implementation drew a separate hover ring.
    removeGraphicsByLabel(mapView, EDIT_GEOMETRY_VERTEX_HOVER_LEGACY_LABEL);

    if (!showVertices) return;

    points.forEach((p) => {
      const coords = getPointCoordinates(p, true);
      if (!coords) return;

      const shouldBeYellow =
        (hoveredPointId != null && hoveredPointId === p.id) ||
        (selectedPointId != null && selectedPointId === p.id);
      const symbol = shouldBeYellow ? VERTEX_YELLOW_SYMBOL : VERTEX_SYMBOL;

      mapView.graphics.add(
        new Graphic({
          geometry: new Point({
            longitude: coords.longitude,
            latitude: coords.latitude,
            spatialReference: { wkid: 4326 },
          }),
          symbol,
          attributes: {
            label: EDIT_GEOMETRY_VERTEX_LABEL,
            pointId: p.id,
          },
        })
      );
    });

    return () => {
      removeGraphicsByLabel(mapView, EDIT_GEOMETRY_VERTEX_LABEL);
      removeGraphicsByLabel(
        mapView,
        EDIT_GEOMETRY_VERTEX_HOVER_LEGACY_LABEL
      );
    };
  }, [mapView, showVertices, points, hoveredPointId, selectedPointId]);
}
