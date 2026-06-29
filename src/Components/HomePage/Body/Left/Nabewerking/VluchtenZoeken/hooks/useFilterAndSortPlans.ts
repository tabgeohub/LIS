/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useFilterPlans } from "hooks/filters/useFilterPlans";

/**
 * Hook to filter and sort plans based on filter criteria
 */
export function useFilterAndSortPlans(
  plans: FinishedFlightPlanType[] | undefined,
  filterTerm: string
) {
  const filterPlans = useFilterPlans();
  const {
    periode,
    dateFrom,
    dateTo,
    setFilteredPlans,
  } = useFinishedPlansState();

  useEffect(() => {
    if (!plans) return;

    const sortedPlansByCreatedAt = plans.sort((a, b) =>
      a.datum > b.datum ? -1 : 1
    );

    filterPlans(
      setFilteredPlans,
      sortedPlansByCreatedAt,
      filterTerm,
      dateFrom,
      dateTo,
      periode
    );
  }, [plans, filterTerm, dateFrom, dateTo, periode]);
}

