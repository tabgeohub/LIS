import { FinishedFlightPlanType } from "Types/finished_plans";
import { useCreateReportState } from "Components/HomePage/hooks/zustand/nabewerking/useCreateReportState";
import { useBindFilteredSortedPlans } from "Components/HomePage/hooks/filters/useFilteredSortedPlans";

/** Bind CreateReport period/filter store to shared filtered-sorted plans helper. */
export function useCreateReportFilterAndSortPlans(
  plans: FinishedFlightPlanType[] | undefined
) {
  const report = useCreateReportState();
  useBindFilteredSortedPlans({
    plans,
    filterText: report.filterTerm,
    source: report,
  });
  return report;
}
