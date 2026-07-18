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

function matchesLastFourWeeks(
  pointDate: number,
  criteria: PointFilterCriteria
): boolean {
  const fourWeeksAgo =
    (criteria.now ?? Date.now()) - 28 * 24 * 60 * 60 * 1000;
  return pointDate >= fourWeeksAgo;
}

function matchesDateRange(
  pointDate: number,
  criteria: PointFilterCriteria
): boolean {
  if (!criteria.dateFrom || !criteria.dateTo) return true;
  const fromDate = new Date(criteria.dateFrom).getTime();
  const toDate = new Date(criteria.dateTo).getTime();
  return pointDate >= fromDate && pointDate <= toDate;
}

function matchesPeriod(
  point: EnrichedPointType,
  criteria: PointFilterCriteria
) {
  if (!point.created_at) return true;
  const pointDate = new Date(point.created_at).getTime();

  if (criteria.periodFilter === "Laatste 4 weken") {
    return matchesLastFourWeeks(pointDate, criteria);
  }

  if (criteria.periodFilter === "Periodoe van-tot") {
    return matchesDateRange(pointDate, criteria);
  }

  return true;
}

function matchesActivity(
  point: EnrichedPointType,
  activityFilter: string
): boolean {
  if (!activityFilter) return true;
  return point.activiteit_id === activityFilter;
}

function matchesFilterText(
  point: EnrichedPointType,
  normalizedText: string
): boolean {
  if (!normalizedText) return true;
  return (point.omschrijving ?? "").toLowerCase().includes(normalizedText);
}

function matchesPointCriteria(
  point: EnrichedPointType,
  criteria: PointFilterCriteria,
  herhalenValue: number,
  normalizedText: string
): boolean {
  if (Number(point.herhalen) !== herhalenValue) return false;
  if (!matchesActivity(point, criteria.activityFilter)) return false;
  if (!matchesPeriod(point, criteria)) return false;
  return matchesFilterText(point, normalizedText);
}

export function filterPointsByCriteria(
  points: EnrichedPointType[],
  criteria: PointFilterCriteria
) {
  const normalizedText = criteria.filterText.trim().toLowerCase();
  const herhalenValue = criteria.herhalen ? 1 : 0;

  return points.filter((point) =>
    matchesPointCriteria(point, criteria, herhalenValue, normalizedText)
  );
}
