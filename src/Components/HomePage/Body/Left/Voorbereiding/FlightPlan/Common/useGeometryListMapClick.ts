import { useEffect } from "react";
import { Geometry } from "hooks/features/useGeometriesStore";
import useGeometryClick from "hooks/hover-click-handlers/useGeometryClick";
import { getHerhalenFilterFromGeometries, toggleGeometrySelection } from "./geometryHerhalen";

export function useGeometryListMapClick(input: {
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
  geometries: Geometry[];
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
}) {
  useEffect(() => {
    if (!input.mapView || !input.redGraphicsLayer) return;

    const handle = input.mapView.on("click", async (event) => {
      event.stopPropagation();
      const hitTestResults = await input.mapView!.hitTest(event);
      const existingFeature = hitTestResults.results.find(
        (result) => (result as __esri.GraphicHit).graphic
      );
      const attributes = (existingFeature as __esri.GraphicHit | undefined)
        ?.graphic?.attributes;

      if (!attributes || attributes.type !== "geometry" || !attributes.geometryId) {
        return;
      }

      const geometry = input.geometries.find(
        (item) => item.id === attributes.geometryId
      );
      if (!geometry) return;

      input.setSelectedGeometries(
        toggleGeometrySelection(input.selectedGeometries, geometry.id)
      );
    });

    return () => handle.remove();
  }, [
    input.selectedGeometries,
    input.geometries,
    input.mapView,
    input.redGraphicsLayer,
    input.setSelectedGeometries,
  ]);
}

export function useGeometryListInteractions(input: {
  geometries: Geometry[];
  dbGeometries: Geometry[];
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
}) {
  const safeSelectedGeometries = Array.isArray(input.selectedGeometries)
    ? input.selectedGeometries
    : [];

  useGeometryClick({
    selectedGeometryIds: safeSelectedGeometries,
    allGeometries: input.dbGeometries,
    herhalenFilter: getHerhalenFilterFromGeometries(input.geometries),
  });

  useGeometryListMapClick({
    mapView: input.mapView,
    redGraphicsLayer: input.redGraphicsLayer,
    geometries: input.geometries,
    selectedGeometries: safeSelectedGeometries,
    setSelectedGeometries: input.setSelectedGeometries,
  });

  return safeSelectedGeometries;
}
