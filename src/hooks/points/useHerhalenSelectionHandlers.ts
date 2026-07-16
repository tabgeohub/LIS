import { useCallback } from "react";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import {
  clearHerhalenSelection,
  selectAllByHerhalen,
  type HerhalenSelectionSetters,
} from "./herhalenSelectionActions";

type GeometryItem = { id: number; herhalen: number | string | boolean };

export type { HerhalenSelectionSetters } from "./herhalenSelectionActions";

export function useHerhalenSelectionHandlers(input: {
  herhalen: boolean;
  setters: HerhalenSelectionSetters;
  filteredGeometries?: GeometryItem[];
}) {
  const { points } = usePointsStore();
  const { geometries } = useGeometriesStore();
  const { herhalen, setters, filteredGeometries } = input;

  const handleSelectAll = useCallback(() => {
    selectAllByHerhalen({
      points,
      geometries: filteredGeometries ?? geometries,
      herhalen,
      setters,
    });
  }, [filteredGeometries, geometries, herhalen, points, setters]);

  const handleSelectNone = useCallback(
    () => clearHerhalenSelection(setters),
    [setters]
  );

  return { handleSelectAll, handleSelectNone };
}
