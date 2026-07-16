/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { ClickableGeometry } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { buildSelectedGeometryGraphics } from "@helpers/ArcGISHelpers/selectedGeometryGraphics";

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

    layer.addMany(
      buildSelectedGeometryGraphics(allGeometries, selectedGeometryIds ?? [])
    );
  }, [selectedGeometryIds, allGeometries, mapView, yellowGeometriesGraphicsLayer]);
}

