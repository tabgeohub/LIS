import { Geometry } from "hooks/features/useGeometriesStore";

const TRUTHY_STRINGS = new Set(["1", "ja", "yes", "true"]);
const TRUTHY_NUMBERS = new Set([1]);

export function isHerhalenTruthy(value: Geometry["herhalen"]): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return TRUTHY_NUMBERS.has(value);
  if (typeof value === "string") return TRUTHY_STRINGS.has(value.toLowerCase());
  return false;
}

export function formatHerhalenLabel(value: Geometry["herhalen"]): string {
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
  const indexMap = new Map<number, number>();
  geometries.forEach((g, i) => indexMap.set(g.id, i));

  const selectedReverseIndex = new Map<number, number>();
  selectedIds.forEach((id, i) => {
    selectedReverseIndex.set(id, selectedIds.length - 1 - i);
  });

  const selectedSet = new Set(selectedIds);

  return [...geometries].sort((a, b) => {
    const aSelected = selectedSet.has(a.id) ? 0 : 1;
    const bSelected = selectedSet.has(b.id) ? 0 : 1;
    if (aSelected !== bSelected) return aSelected - bSelected;

    if (selectedSet.has(a.id) && selectedSet.has(b.id)) {
      return (
        (selectedReverseIndex.get(a.id) ?? 0) -
        (selectedReverseIndex.get(b.id) ?? 0)
      );
    }

    return (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0);
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
