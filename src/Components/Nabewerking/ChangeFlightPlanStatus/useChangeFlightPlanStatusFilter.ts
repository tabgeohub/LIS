/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useFilterPlans } from "Components/HomePage/hooks/filters/useFilterPlans";
import { useChangePlanStatusState } from "Components/HomePage/hooks/zustand/nabewerking/useChangePlanStatusState";
import type { FlightPlanType } from "Types";

export function useChangeFlightPlanStatusFilter(
  preparedFlightPlans: FlightPlanType[] | undefined
) {
  const filterPlans = useFilterPlans();
  const { filterTerm, periode, dateFrom, dateTo, setFilteredPlans } =
    useChangePlanStatusState();

  useEffect(() => {
    if (!preparedFlightPlans) return;
    filterPlans({
      setFilteredPlans,
      plans: preparedFlightPlans,
      filterText: filterTerm,
      dateFrom,
      dateTo,
      periodFilter: periode,
    });
  }, [preparedFlightPlans, filterTerm, periode]);
}
