/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { Geometry } from "./useGeometriesStore";
import { createGeometryGraphics } from "@helpers/ArcGISHelpers/createGeometryGraphic";

/**
 * Hook to render geometries locally on the map (for component-specific rendering)
 * @param geometries - Array of geometries to render
 */
export function useRenderLocalGeometries(geometries: Geometry[]) {
  const { mapView, geometriesGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView || !geometriesGraphicsLayer) return;

    geometriesGraphicsLayer.removeAll();

    if (!geometries.length) return;

    const graphics = createGeometryGraphics(geometries, {
      attributes: {
        // Ensure all required attributes are included
      },
    });

    if (graphics.length > 0) {
      geometriesGraphicsLayer.addMany(graphics);
    }

    // Cleanup on unmount
    return () => {
      geometriesGraphicsLayer.removeAll();
    };
  }, [geometries, mapView, geometriesGraphicsLayer]);
}

