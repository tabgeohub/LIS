import { useCallback } from "react";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { filterByHerhalen } from "@helpers/points/herhalenFilter";

type GeometryItem = { id: number; herhalen: number | string | boolean };

export type HerhalenSelectionSetters = {
  setSelectedPoints: (ids: number[]) => void;
  setSelectedPoints2: (ids: number[]) => void;
  setSelectedGeometries: (ids: number[]) => void;
  setSelectedGeometries2?: (ids: number[]) => void;
};

export function useHerhalenSelectionHandlers(input: {
  herhalen: boolean;
  setters: HerhalenSelectionSetters;
  filteredGeometries?: GeometryItem[];
}) {
  const { points } = usePointsStore();
  const { geometries } = useGeometriesStore();
  const { herhalen, setters, filteredGeometries } = input;

  const handleSelectAll = useCallback(() => {
    const matchingPoints = filterByHerhalen(points, herhalen);
    const matchingGeometries =
      filteredGeometries ?? filterByHerhalen(geometries, herhalen);
    const geometryIds = matchingGeometries.map((geometry) => geometry.id);

    if (herhalen) {
      setters.setSelectedPoints(matchingPoints.map((point) => point.id));
      setters.setSelectedGeometries(geometryIds);
    } else {
      setters.setSelectedPoints2(matchingPoints.map((point) => point.id));
      if (setters.setSelectedGeometries2) {
        setters.setSelectedGeometries2(geometryIds);
      } else {
        setters.setSelectedGeometries(geometryIds);
      }
    }
  }, [filteredGeometries, geometries, herhalen, points, setters]);

  const handleSelectNone = useCallback(() => {
    setters.setSelectedPoints([]);
    setters.setSelectedPoints2([]);
    setters.setSelectedGeometries([]);
    setters.setSelectedGeometries2?.([]);
  }, [setters]);

  return { handleSelectAll, handleSelectNone };
}
