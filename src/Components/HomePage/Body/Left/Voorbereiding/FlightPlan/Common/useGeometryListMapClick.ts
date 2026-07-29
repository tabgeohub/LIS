import { useEffect } from "react";
import { Geometry } from "hooks/features/useGeometriesStore";
import useGeometryClick from "Components/HomePage/hooks/hover-click-handlers/useGeometryClick";
import { getHerhalenFilterFromGeometries } from "./geometryHerhalen";
import { selectGeometryFromMapClick } from "./selectGeometryFromMapClick";

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
      await selectGeometryFromMapClick({
        mapView: input.mapView!,
        event,
        geometries: input.geometries,
        selectedGeometries: input.selectedGeometries,
        setSelectedGeometries: input.setSelectedGeometries,
      });
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
