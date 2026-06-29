import { filterPlansByPeriod } from "./filterPlansByPeriod";

export function useFilterPlans() {
  return function filterPlans<T extends { datum: string; vluchtnummer: string }>(
    setFilteredPlans: (value: T[]) => void,
    plans: T[],
    filterText?: string,
    dateFrom?: string,
    dateTo?: string,
    periodFilter?: string
  ) {
    setFilteredPlans(
      filterPlansByPeriod(plans, filterText, dateFrom, dateTo, periodFilter)
    );
  };
}
