import { Geometry, useGeometriesStore } from "hooks/features/useGeometriesStore";
import useGeometryListHover from "Components/HomePage/hooks/hover-click-handlers/useGeometryListHover";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useGeometryListInteractions } from "./useGeometryListMapClick";
import { useGeometryListGraphics } from "./useGeometryListGraphics";

export function useGeometriesListBase(input: {
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
  geometries: Geometry[];
}) {
  const { mapView, redGraphicsLayer, geometriesGraphicsLayer } = useMapViewState();
  const { dbGeometries } = useGeometriesStore();
  const hover = useGeometryListHover();
  const safeSelectedGeometries = useGeometryListInteractions({
    geometries: input.geometries,
    dbGeometries,
    selectedGeometries: input.selectedGeometries,
    setSelectedGeometries: input.setSelectedGeometries,
    mapView,
    redGraphicsLayer,
  });
  useGeometryListGraphics({
    mapView,
    geometriesGraphicsLayer,
    geometries: input.geometries,
    selectedGeometryIds: safeSelectedGeometries,
  });
  return { hover, safeSelectedGeometries };
}
