import FlightPlanFilterPanel from "Components/HomePage/Body/Left/Common/FlightPlanFilterPanel";
import { usePlansFilterStore } from "hooks/filters/usePlansFilterStore";
import { useViewPlanState } from "Components/HomePage/hooks/zustand/voorbereiding/useViewPlanState";
import type { FlightPlanType } from "Types";

export default function Filter({ plans }: { plans: FlightPlanType[] }) {
  const filters = usePlansFilterStore();
  const workflow = useViewPlanState();

  return (
    <FlightPlanFilterPanel
      plans={plans}
      filterText={filters.filterText}
      dateFrom={filters.dateFrom}
      setDateFrom={filters.setDateFrom}
      dateTo={filters.dateTo}
      setDateTo={filters.setDateTo}
      periodFilter={filters.periodFilter}
      setPeriodFilter={filters.setPeriodFilter}
      setOpenFilter={workflow.setOpenFilter}
      setFilteredPlans={workflow.setFilteredPlans}
    />
  );
}
