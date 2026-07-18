/**
 * Sort points with selected items first; among selected, last-clicked appears first.
 */
function selectionPriority(id: number, selectedPointIds: number[]): number {
  return selectedPointIds.includes(id) ? 0 : 1;
}

function compareSelectedReverseOrder(
  aId: number,
  bId: number,
  selectedReverseIndexMap: Map<number, number>
): number {
  return (
    (selectedReverseIndexMap.get(aId) ?? 0) -
    (selectedReverseIndexMap.get(bId) ?? 0)
  );
}

function compareOriginalIndex(
  aId: number,
  bId: number,
  indexMap: Map<number, number>
): number {
  return (indexMap.get(aId) ?? 0) - (indexMap.get(bId) ?? 0);
}

type CompareSelectionOrderInput = {
  aId: number;
  bId: number;
  selectedPointIds: number[];
  selectedReverseIndexMap: Map<number, number>;
  indexMap: Map<number, number>;
};

function comparePointsWithSelectionOrder(
  input: CompareSelectionOrderInput
): number {
  const { aId, bId, selectedPointIds, selectedReverseIndexMap, indexMap } =
    input;
  const selOrder =
    selectionPriority(aId, selectedPointIds) -
    selectionPriority(bId, selectedPointIds);
  if (selOrder !== 0) return selOrder;

  if (
    selectedPointIds.includes(aId) &&
    selectedPointIds.includes(bId)
  ) {
    return compareSelectedReverseOrder(aId, bId, selectedReverseIndexMap);
  }

  return compareOriginalIndex(aId, bId, indexMap);
}

export function sortPointsWithSelectionOrder<T extends { id: number }>(
  points: T[],
  selectedPointIds: number[]
): T[] {
  const indexMap = new Map<number, number>();
  points.forEach((p, i) => indexMap.set(p.id, i));

  const selectedReverseIndexMap = new Map<number, number>();
  selectedPointIds.forEach((id, i) => {
    selectedReverseIndexMap.set(id, selectedPointIds.length - 1 - i);
  });

  return [...points].sort((a, b) =>
    comparePointsWithSelectionOrder({
      aId: a.id,
      bId: b.id,
      selectedPointIds,
      selectedReverseIndexMap,
      indexMap,
    })
  );
}
