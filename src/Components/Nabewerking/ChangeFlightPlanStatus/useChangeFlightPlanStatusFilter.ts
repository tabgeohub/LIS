/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useFilterPlans } from "hooks/filters/useFilterPlans";
import { useChangePlanStatusState } from "Components/Nabewerking/ChangeFlightPlanStatus/useChangePlanStatusState";
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
