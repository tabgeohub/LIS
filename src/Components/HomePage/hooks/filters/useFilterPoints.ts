import { usePointsFilterStore } from "Components/HomePage/hooks/filters/usePointsFilterStore";
import { usePointsStore } from "hooks/features";
import { EnrichedPointType } from "Types";
import { filterPointsByCriteria } from "./filterPointsByCriteria";

export function useFilterPoints() {
  const { activityFilter, periodFilter, dateFrom, dateTo, filterText } =
    usePointsFilterStore();

  const { points } = usePointsStore();

  function filterPoints(
    herhalen: boolean,
    setFilteredPoints: (value: EnrichedPointType[]) => void
  ) {
    setFilteredPoints(
      filterPointsByCriteria(points, {
        herhalen,
        activityFilter,
        periodFilter,
        dateFrom,
        dateTo,
        filterText,
      })
    );
  }

  return filterPoints;
}
