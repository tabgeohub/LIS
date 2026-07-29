import { filterByHerhalen } from "./herhalenFilter";

type SelectableHerhalenItem = {
  id: number;
  herhalen?: number | string | boolean | null;
};

export function buildHerhalenSelection(input: {
  points: SelectableHerhalenItem[];
  geometries: SelectableHerhalenItem[];
  herhalen: boolean;
}) {
  return {
    pointIds: filterByHerhalen(input.points, input.herhalen).map(
      (point) => point.id
    ),
    geometryIds: filterByHerhalen(input.geometries, input.herhalen).map(
      (geometry) => geometry.id
    ),
  };
}
