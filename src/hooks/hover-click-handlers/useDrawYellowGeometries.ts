/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { Geometry } from "hooks/features/useGeometriesStore";
import { createGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryGraphic";

interface UseDrawYellowGeometriesOptions {
  selectedGeometryIds: number[];
  geometries: Geometry[]; // Not used, kept for API compatibility
  allGeometries: Geometry[];
  herhalenFilter?: boolean | null;
}

/**
 * Hook for drawing yellow geometries on the map (similar to useDrawYellowMarkers)
 * Renders selected geometries in yellow on the yellowGraphicsLayer
 */
export default function useDrawYellowGeometries({
  selectedGeometryIds,
  geometries,
  allGeometries,
  herhalenFilter,
}: UseDrawYellowGeometriesOptions) {
  const { mapView, yellowGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView || !yellowGraphicsLayer) return;

    yellowGraphicsLayer.graphics.removeAll();

    if (!selectedGeometryIds || selectedGeometryIds.length === 0) {
      return;
    }

    selectedGeometryIds.forEach((geometryId) => {
      // Use allGeometries for lookup to ensure selected geometries are found even if filtered out
      const geometry = allGeometries.find((g) => g.id === geometryId);
      if (!geometry || !geometry.points || geometry.points.length === 0) return;

      // Filter by herhalen if herhalenFilter is provided
      if (herhalenFilter !== null && herhalenFilter !== undefined) {
        const geometryHerhalen =
          typeof geometry.herhalen === "number"
            ? geometry.herhalen === 1
            : typeof geometry.herhalen === "string"
              ? geometry.herhalen === "1"
              : geometry.herhalen === true;

        // Only draw geometries that match the herhalen filter
        if (geometryHerhalen !== herhalenFilter) {
          return;
        }
      }

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
        yellowGraphicsLayer.add(graphic);
      }
    });
  }, [selectedGeometryIds, allGeometries, herhalenFilter, mapView, yellowGraphicsLayer]);
}

