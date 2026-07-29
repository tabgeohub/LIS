/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { Geometry } from "hooks/features/useGeometriesStore";
import { syncLocalGeometryGraphics } from "./syncLocalGeometryGraphics";

/** Render geometries locally on the map (component-specific layer). */
export function useRenderLocalGeometries(geometries: Geometry[]) {
  const { mapView, geometriesGraphicsLayer } = useMapViewState();

  useEffect(
    () =>
      syncLocalGeometryGraphics({ mapView, geometriesGraphicsLayer, geometries }),
    [geometries, mapView, geometriesGraphicsLayer]
  );
}
