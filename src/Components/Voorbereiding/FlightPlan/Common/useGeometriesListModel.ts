import { Geometry } from "hooks/features";
import { useGeometriesListBase } from "./useGeometriesListBase";
import { useGeometriesListLogEffect } from "./useGeometriesListLogEffect";
import { useGeometriesListSelection } from "./useGeometriesListSelection";

export function useGeometriesListModel(input: {
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
  geometries: Geometry[];
}) {
  const { hover, safeSelectedGeometries } = useGeometriesListBase(input);
  useGeometriesListLogEffect(input.geometries, safeSelectedGeometries);
  return {
    hover,
    safeSelectedGeometries,
    ...useGeometriesListSelection({
      geometries: input.geometries,
      safeSelectedGeometries,
      setSelectedGeometries: input.setSelectedGeometries,
    }),
  };
}
