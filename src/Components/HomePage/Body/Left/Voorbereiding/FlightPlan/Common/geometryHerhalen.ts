import { Geometry } from "hooks/features/useGeometriesStore";

const TRUTHY_STRINGS = new Set(["1", "ja", "yes", "true"]);
const TRUTHY_NUMBERS = new Set([1]);

type HerhalenValue = Geometry["herhalen"] | string;

export function isHerhalenTruthy(value: HerhalenValue): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return TRUTHY_NUMBERS.has(value);
  if (typeof value === "string") return TRUTHY_STRINGS.has(value.toLowerCase());
  return false;
}

export function formatHerhalenLabel(value: HerhalenValue): string {
  return isHerhalenTruthy(value) ? "Ja" : "Nee";
}

export function getHerhalenFilterFromGeometries(
  geometries: Geometry[]
): boolean | null {
  const first = geometries.at(0);
  if (first === undefined) return null;
  return isHerhalenTruthy(first.herhalen);
}

type GeometrySelectionSortContext = {
  selectedSet: Set<number>;
  selectedRank: Map<number, number>;
  originalIndex: Map<number, number>;
};

export function sortGeometriesForSelection(
  geometries: Geometry[],
  selectedIds: number[]
): Geometry[] {
  const context: GeometrySelectionSortContext = {
    selectedSet: new Set(selectedIds),
    selectedRank: new Map(
      selectedIds.map((id, index) => [id, selectedIds.length - 1 - index])
    ),
    originalIndex: new Map(
      geometries.map((geometry, index) => [geometry.id, index])
    ),
  };

  return [...geometries].sort((a, b) =>
    compareGeometriesForSelection(a, b, context)
  );
}

function compareGeometriesForSelection(
  a: Geometry,
  b: Geometry,
  context: GeometrySelectionSortContext
): number {
  const selectionDifference =
    Number(!context.selectedSet.has(a.id)) -
    Number(!context.selectedSet.has(b.id));
  if (selectionDifference !== 0) return selectionDifference;
  const rank = context.selectedSet.has(a.id)
    ? context.selectedRank
    : context.originalIndex;
  return (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0);
}

export function toggleGeometrySelection(
  selectedIds: number[],
  geometryId: number
): number[] {
  if (selectedIds.includes(geometryId)) {
    return selectedIds.filter((id) => id !== geometryId);
  }
  return [...selectedIds, geometryId];
}
