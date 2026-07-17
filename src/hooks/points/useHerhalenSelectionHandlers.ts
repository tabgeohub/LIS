import { useMemo } from "react";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import {
  createHerhalenSelectionHandlers,
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

  return useMemo(
    () =>
      createHerhalenSelectionHandlers({
        points,
        geometries: input.filteredGeometries ?? geometries,
        herhalen: input.herhalen,
        setters: input.setters,
      }),
    [geometries, input.filteredGeometries, input.herhalen, input.setters, points]
  );
}
