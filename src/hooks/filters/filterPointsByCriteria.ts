import type { EnrichedPointType } from "Types";

export type PointFilterCriteria = {
  herhalen: boolean;
  activityFilter: string;
  periodFilter: string;
  dateFrom: string;
  dateTo: string;
  filterText: string;
  now?: number;
};

function matchesPeriod(point: EnrichedPointType, criteria: PointFilterCriteria) {
  if (!point.created_at) return true;
  const pointDate = new Date(point.created_at).getTime();

  if (criteria.periodFilter === "Laatste 4 weken") {
    const fourWeeksAgo = (criteria.now ?? Date.now()) - 28 * 24 * 60 * 60 * 1000;
    return pointDate >= fourWeeksAgo;
  }

  if (
    criteria.periodFilter === "Periodoe van-tot" &&
    criteria.dateFrom &&
    criteria.dateTo
  ) {
    const fromDate = new Date(criteria.dateFrom).getTime();
    const toDate = new Date(criteria.dateTo).getTime();
    return pointDate >= fromDate && pointDate <= toDate;
  }

  return true;
}

export function filterPointsByCriteria(
  points: EnrichedPointType[],
  criteria: PointFilterCriteria
) {
  const normalizedText = criteria.filterText.trim().toLowerCase();
  const herhalenValue = criteria.herhalen ? 1 : 0;

  return points.filter((point) => {
    if (Number(point.herhalen) !== herhalenValue) return false;
    if (criteria.activityFilter && point.activiteit_id !== criteria.activityFilter) {
      return false;
    }
    if (!matchesPeriod(point, criteria)) return false;
    return (
      !normalizedText ||
      (point.omschrijving ?? "").toLowerCase().includes(normalizedText)
    );
  });
}
