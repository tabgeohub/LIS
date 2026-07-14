/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFilterPlans } from "./useFilterPlans";

type FilteredSortedPlansOptions = {
  plans: FinishedFlightPlanType[] | undefined;
  filterText: string;
  periodFilter: string;
  dateFrom: string;
  dateTo: string;
  setFilteredPlans: (plans: FinishedFlightPlanType[]) => void;
};

export function useFilteredSortedPlans({
  plans,
  filterText,
  periodFilter,
  dateFrom,
  dateTo,
  setFilteredPlans,
}: FilteredSortedPlansOptions) {
  const filterPlans = useFilterPlans();

  useEffect(() => {
    if (!plans) return;

    filterPlans({
      setFilteredPlans,
      plans: [...plans].sort((a, b) => (a.datum > b.datum ? -1 : 1)),
      filterText,
      dateFrom,
      dateTo,
      periodFilter,
    });
  }, [plans, filterText, periodFilter, dateFrom, dateTo]);
}
