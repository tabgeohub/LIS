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

/** Bind store filter fields to useFilteredSortedPlans (shared by VluchtenZoeken / CreateReport). */
export function useBindFilteredSortedPlans(input: {
  plans: FinishedFlightPlanType[] | undefined;
  filterText: string;
  source: {
    periode: string;
    dateFrom: string;
    dateTo: string;
    setFilteredPlans: (plans: FinishedFlightPlanType[]) => void;
  };
}) {
  useFilteredSortedPlans({
    plans: input.plans,
    filterText: input.filterText,
    periodFilter: input.source.periode,
    dateFrom: input.source.dateFrom,
    dateTo: input.source.dateTo,
    setFilteredPlans: input.source.setFilteredPlans,
  });
}
