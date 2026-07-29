import { useMemo } from "react";
import { usePointsStore } from "hooks/features";
import { useGeometriesStore } from "hooks/features";
import {
  createHerhalenSelectionHandlers,
  type HerhalenSelectionSetters,
} from "./herhalenSelectionActions";

export type { HerhalenSelectionSetters } from "./herhalenSelectionActions";

type GeometryItem = { id: number; herhalen: number | string | boolean };

export function useHerhalenSelectionHandlers(input: {
  herhalen: boolean;
  setters: HerhalenSelectionSetters;
  filteredGeometries?: GeometryItem[];
}) {
  const { points } = usePointsStore();
  const { geometries } = useGeometriesStore();
  const { herhalen, setters, filteredGeometries } = input;

  return useMemo(
    () =>
      createHerhalenSelectionHandlers({
        points,
        geometries: filteredGeometries ?? geometries,
        herhalen,
        setters,
      }),
    [filteredGeometries, geometries, herhalen, points, setters]
  );
}
