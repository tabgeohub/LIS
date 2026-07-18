import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useBindFilteredSortedPlans } from "hooks/filters/useFilteredSortedPlans";

/**
 * Hook to filter and sort plans based on filter criteria
 */
export function useFilterAndSortPlans(
  plans: FinishedFlightPlanType[] | undefined,
  filterTerm: string
) {
  const { periode, dateFrom, dateTo, setFilteredPlans } =
    useFinishedPlansState();

  useBindFilteredSortedPlans({
    plans,
    filterText: filterTerm,
    source: {
      periode,
      dateFrom,
      dateTo,
      setFilteredPlans,
    },
  });
}
