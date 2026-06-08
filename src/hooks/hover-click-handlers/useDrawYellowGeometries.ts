/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { ClickableGeometry } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { createSelectionGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

interface UseDrawYellowGeometriesOptions {
  selectedGeometryIds: number[];
  geometries: ClickableGeometry[]; // Not used, kept for API compatibility
  allGeometries: ClickableGeometry[];
  herhalenFilter?: boolean | null;
}

/**
 * Hook for drawing yellow geometries on the map (similar to useDrawYellowMarkers)
 * Renders selected geometries in yellow on the yellowGeometriesGraphicsLayer
 */
export default function useDrawYellowGeometries({
  selectedGeometryIds,
  geometries,
  allGeometries,
  herhalenFilter,
}: UseDrawYellowGeometriesOptions) {
  const { mapView, yellowGeometriesGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!validateMapView(mapView, yellowGeometriesGraphicsLayer)) return;

    const layer = yellowGeometriesGraphicsLayer!;
    layer.graphics.removeAll();

    if (!selectedGeometryIds || selectedGeometryIds.length === 0) {
      return;
    }

    selectedGeometryIds.forEach((geometryId) => {
      // Use allGeometries for lookup to ensure selected geometries are found even if filtered out
      const geometry = allGeometries.find((g) => g.id === geometryId);
      if (!geometry || !geometry.points || geometry.points.length === 0) return;

      // Selected geometries should always be drawn in yellow, regardless of herhalenFilter
      // The filter only applies to which geometries appear in the list (blue layer)

      const graphic = createSelectionGeometryGraphic(geometry, geometry);

      if (graphic) {
        layer.add(graphic);
      }
    });
  }, [selectedGeometryIds, allGeometries, mapView, yellowGeometriesGraphicsLayer]);
}

