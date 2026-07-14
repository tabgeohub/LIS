import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useFilteredSortedPlans } from "hooks/filters/useFilteredSortedPlans";

/**
 * Hook to filter and sort plans based on filter criteria
 */
export function useFilterAndSortPlans(
  plans: FinishedFlightPlanType[] | undefined,
  filterTerm: string
) {
  const {
    periode,
    dateFrom,
    dateTo,
    setFilteredPlans,
  } = useFinishedPlansState();

  useFilteredSortedPlans({
    plans,
    filterText: filterTerm,
    periodFilter: periode,
    dateFrom,
    dateTo,
    setFilteredPlans,
  });
}

