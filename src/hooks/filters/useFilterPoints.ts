import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import { EnrichedPointType } from "Types";

export function useFilterPoints() {
  const { activityFilter, periodFilter, dateFrom, dateTo, filterText } =
    usePointsFilterStore();

  const { points } = usePointsStore();

  function filterPoints(
    herhalen: boolean,
    setFilteredPoints: (value: EnrichedPointType[]) => void
  ) {
    const herhalenFilter = herhalen ? 1 : 0;

    const filteredPoints = points.filter((point) => {
      if (Number(point.herhalen) !== herhalenFilter) {
        return false;
      }
      if (
        activityFilter &&
        activityFilter !== "" &&
        point.activiteit_id !== activityFilter
      ) {
        return false;
      }
      if (periodFilter === "Laatste 4 weken" && point.created_at) {
        const pointDate = new Date(point.created_at).getTime();
        const fourWeeksAgo = Date.now() - 28 * 24 * 60 * 60 * 1000;
        if (pointDate < fourWeeksAgo) {
          return false;
        }
      } else if (
        periodFilter === "Periodoe van-tot" &&
        dateFrom &&
        dateTo &&
        point.created_at
      ) {
        const pointDate = new Date(point.created_at).getTime();
        const fromDate = new Date(dateFrom).getTime();
        const toDate = new Date(dateTo).getTime();
        if (pointDate < fromDate || pointDate > toDate) {
          return false;
        }
      }
      if (
        filterText &&
        filterText.trim() !== "" &&
        !(point.omschrijving || "")
          .toLowerCase()
          .includes(filterText.toLowerCase())
      ) {
        return false;
      }

      if (filterText === "") {
        return true;
      }

      return true;
    });

    setFilteredPoints(filteredPoints);
  }

  return filterPoints;
}
