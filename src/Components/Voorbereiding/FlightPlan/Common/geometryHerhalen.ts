import { Geometry } from "hooks/features";

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
    compareGeometriesForSelection({ a, b, context })
  );
}

function unselectedRank(input: {
  id: number;
  selectedSet: Set<number>;
}): number {
  return Number(!input.selectedSet.has(input.id));
}

function mapRankDelta(input: {
  aId: number;
  bId: number;
  rank: Map<number, number>;
}): number {
  return (input.rank.get(input.aId) ?? 0) - (input.rank.get(input.bId) ?? 0);
}

function rankMapForGeometry(input: {
  id: number;
  context: GeometrySelectionSortContext;
}): Map<number, number> {
  if (input.context.selectedSet.has(input.id)) return input.context.selectedRank;
  return input.context.originalIndex;
}

function compareGeometriesForSelection(input: {
  a: Geometry;
  b: Geometry;
  context: GeometrySelectionSortContext;
}): number {
  const selectionDifference =
    unselectedRank({ id: input.a.id, selectedSet: input.context.selectedSet }) -
    unselectedRank({ id: input.b.id, selectedSet: input.context.selectedSet });
  if (selectionDifference !== 0) return selectionDifference;
  return mapRankDelta({
    aId: input.a.id,
    bId: input.b.id,
    rank: rankMapForGeometry({ id: input.a.id, context: input.context }),
  });
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
