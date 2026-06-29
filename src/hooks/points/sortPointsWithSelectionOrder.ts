/**
 * Sort points with selected items first; among selected, last-clicked appears first.
 */
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

  const isSelected = (id: number) => (selectedPointIds.includes(id) ? 0 : 1);

  return [...points].sort((a, b) => {
    const selOrder = isSelected(a.id) - isSelected(b.id);
    if (selOrder !== 0) return selOrder;

    if (
      selectedPointIds.includes(a.id) &&
      selectedPointIds.includes(b.id)
    ) {
      const aReverseIndex = selectedReverseIndexMap.get(a.id) ?? 0;
      const bReverseIndex = selectedReverseIndexMap.get(b.id) ?? 0;
      return aReverseIndex - bReverseIndex;
    }

    return (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0);
  });
}
