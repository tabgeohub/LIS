import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlansState } from "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState";
import { useBindFilteredSortedPlans } from "hooks/filters/useFilteredSortedPlans";

/**
 * Hook to filter and sort plans based on filter criteria
 */
export function useFilterAndSortPlans(input: {
  plans: FinishedFlightPlanType[] | undefined;
  filterTerm: string;
}) {
  const finished = useFinishedPlansState();
  useBindFilteredSortedPlans({
    plans: input.plans,
    filterText: input.filterTerm,
    source: finished,
  });
}
