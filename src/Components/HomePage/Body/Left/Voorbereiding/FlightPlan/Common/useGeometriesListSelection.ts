import { useMemo } from "react";
import { Geometry } from "hooks/features/useGeometriesStore";
import {
  sortGeometriesForSelection,
  toggleGeometrySelection,
} from "./geometryHerhalen";

export function useGeometriesListSelection(input: {
  geometries: Geometry[];
  safeSelectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
}) {
  return {
    sortedGeometries: useMemo(
      () =>
        sortGeometriesForSelection(
          input.geometries,
          input.safeSelectedGeometries
        ),
      [input.geometries, input.safeSelectedGeometries]
    ),
    handleGeometryClick: (geometry: Geometry) =>
      input.setSelectedGeometries(
        toggleGeometrySelection(input.safeSelectedGeometries, geometry.id)
      ),
    selectOnly: (id: number) => input.setSelectedGeometries([id]),
  };
}
