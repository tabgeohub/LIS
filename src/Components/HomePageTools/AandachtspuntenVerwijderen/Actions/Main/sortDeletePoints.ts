import type { EnrichedPointType } from "Types";

export function sortPointsWithSelectedFirst(input: {
  points: EnrichedPointType[];
  filterTerm: string;
  selectedPoints: EnrichedPointType[];
}) {
  const term = input.filterTerm.toLowerCase();
  const filtered = input.points.filter((point) =>
    point.omschrijving.toLowerCase().includes(term)
  );

  const selectedId =
    input.selectedPoints.length === 1 ? input.selectedPoints[0]?.id : null;

  if (!selectedId) return filtered;

  const selected = filtered.find((p) => p.id === selectedId);
  if (!selected) return filtered;

  return [selected, ...filtered.filter((p) => p.id !== selectedId)];
}
