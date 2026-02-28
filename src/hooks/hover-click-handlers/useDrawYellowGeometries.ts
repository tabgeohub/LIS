/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { Geometry } from "hooks/features/useGeometriesStore";
import { createGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

interface UseDrawYellowGeometriesOptions {
  selectedGeometryIds: number[];
  geometries: Geometry[]; // Not used, kept for API compatibility
  allGeometries: Geometry[];
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

    yellowGeometriesGraphicsLayer.graphics.removeAll();

    if (!selectedGeometryIds || selectedGeometryIds.length === 0) {
      return;
    }

    selectedGeometryIds.forEach((geometryId) => {
      // Use allGeometries for lookup to ensure selected geometries are found even if filtered out
      const geometry = allGeometries.find((g) => g.id === geometryId);
      if (!geometry || !geometry.points || geometry.points.length === 0) return;

      // Selected geometries should always be drawn in yellow, regardless of herhalenFilter
      // The filter only applies to which geometries appear in the list (blue layer)

      // Use the createGeometryGraphic utility with yellow symbol options
      const graphic = createGeometryGraphic(geometry, {
        symbolOptions: {
          fillColor: [0, 0, 0, 0], // Transparent fill
          outlineColor: [255, 255, 0, 1], // Yellow outline
          lineColor: [255, 255, 0, 1], // Yellow line
          outlineWidth: 3,
          lineWidth: 4,
        },
        attributes: geometry,
      });

      if (graphic) {
        yellowGeometriesGraphicsLayer.add(graphic);
      }
    });
  }, [selectedGeometryIds, allGeometries, mapView, yellowGeometriesGraphicsLayer]);
}

