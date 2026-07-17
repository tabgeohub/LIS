/**
 * Sort points with selected items first; among selected, last-clicked appears first.
 */
function comparePointsWithSelectionOrder(
  aId: number,
  bId: number,
  selectedPointIds: number[],
  selectedReverseIndexMap: Map<number, number>,
  indexMap: Map<number, number>
): number {
  const isSelected = (id: number) => (selectedPointIds.includes(id) ? 0 : 1);
  const selOrder = isSelected(aId) - isSelected(bId);
  if (selOrder !== 0) return selOrder;

  if (
    selectedPointIds.includes(aId) &&
    selectedPointIds.includes(bId)
  ) {
    const aReverseIndex = selectedReverseIndexMap.get(aId) ?? 0;
    const bReverseIndex = selectedReverseIndexMap.get(bId) ?? 0;
    return aReverseIndex - bReverseIndex;
  }

  return (indexMap.get(aId) ?? 0) - (indexMap.get(bId) ?? 0);
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
    comparePointsWithSelectionOrder(
      a.id,
      b.id,
      selectedPointIds,
      selectedReverseIndexMap,
      indexMap
    )
  );
}
