import FlightPlanFilterPanel from "Components/Common/FlightPlanFilterPanel";
import { usePlansFilterStore } from "hooks/filters/usePlansFilterStore";
import { useReuseFlightPlan } from "Components/Voorbereiding/ReuseFlightPlan/useReuseFlightPlan";
import type { FlightPlanType } from "Types";

export default function Filter({ plans }: { plans: FlightPlanType[] }) {
  const filters = usePlansFilterStore();
  const workflow = useReuseFlightPlan();

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
