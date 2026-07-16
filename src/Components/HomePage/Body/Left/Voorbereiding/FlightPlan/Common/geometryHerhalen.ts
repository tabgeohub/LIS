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

export function sortGeometriesForSelection(
  geometries: Geometry[],
  selectedIds: number[]
): Geometry[] {
  const selectedSet = new Set(selectedIds);
  const originalIndex = new Map(
    geometries.map((geometry, index) => [geometry.id, index])
  );
  const selectedRank = new Map(
    selectedIds.map((id, index) => [id, selectedIds.length - 1 - index])
  );

  return [...geometries].sort((a, b) => {
    const selectionDifference =
      Number(!selectedSet.has(a.id)) - Number(!selectedSet.has(b.id));
    if (selectionDifference !== 0) return selectionDifference;
    const rank = selectedSet.has(a.id) ? selectedRank : originalIndex;
    return (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0);
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
