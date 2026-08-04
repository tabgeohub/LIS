import FlightPlanFilterPanel from "Components/HomePage/Body/Left/Common/FlightPlanFilterPanel";
import { usePlansFilterStore } from "Components/HomePage/hooks/filters/usePlansFilterStore";
import { useDeleteFlightPlan } from "Components/Voorbereiding/RemoveFlightPlan/useDeleteFlightPlan";
import type { FlightPlanType } from "Types";

export default function Filter({ plans }: { plans: FlightPlanType[] }) {
  const filters = usePlansFilterStore();
  const workflow = useDeleteFlightPlan();

  return (
    <FlightPlanFilterPanel
      plans={plans}
      filterText={workflow.filterTerm}
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
