import { filterPlansByPeriod } from "./filterPlansByPeriod";

export type FilterPlansInput<T extends { datum: string; vluchtnummer: string }> =
  {
    setFilteredPlans: (value: T[]) => void;
    plans: T[];
    filterText?: string;
    dateFrom?: string;
    dateTo?: string;
    periodFilter?: string;
  };

export function useFilterPlans() {
  return function filterPlans<T extends { datum: string; vluchtnummer: string }>(
    input: FilterPlansInput<T>
  ) {
    const { setFilteredPlans, plans, filterText, dateFrom, dateTo, periodFilter } =
      input;

    setFilteredPlans(
      filterPlansByPeriod({ plans, filterText, dateFrom, dateTo, periodFilter })
    );
  };
}
