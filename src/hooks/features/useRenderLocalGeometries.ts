/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { Geometry } from "./useGeometriesStore";
import { createGeometryGraphics } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { replaceGraphics } from "@helpers/ArcGISHelpers/replaceGraphics";

/**
 * Hook to render geometries locally on the map (for component-specific rendering)
 * @param geometries - Array of geometries to render
 */
export function useRenderLocalGeometries(geometries: Geometry[]) {
  const { mapView, geometriesGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!validateMapView(mapView, geometriesGraphicsLayer)) return;

    if (!geometries.length) {
      geometriesGraphicsLayer.removeAll();
      return;
    }

    const graphics = createGeometryGraphics(geometries, {
      attributes: {
        // Ensure all required attributes are included
      },
    });

    replaceGraphics(geometriesGraphicsLayer, graphics);

    // Cleanup on unmount
    return () => {
      geometriesGraphicsLayer.removeAll();
    };
  }, [geometries, mapView, geometriesGraphicsLayer]);
}

