/* eslint-disable react-hooks/exhaustive-deps */
import Buttons from "./Buttons";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { useFullPreparedFlightPlans } from "api-hooks/flightPlans";
import { useChangePlanStatusState } from "Components/HomePage/hooks/zustand/nabewerking/useChangePlanStatusState";
import Filter from "./Filter";
import { useContent } from "hooks/useContent";
import { useAuth } from "hooks/zustand/ui";
import { ChangeFlightPlanStatusList } from "./ChangeFlightPlanStatusList";
import { useChangeFlightPlanStatusFilter } from "./useChangeFlightPlanStatusFilter";

export default function ChangeFlightPlanStatus() {
  const { user } = useAuth();
  const { data: preparedFlightPlans } = useFullPreparedFlightPlans({
    regioId: user.role,
    userId: user.user_id,
  });
  const { setFilterTerm, openFilter, filterTerm, filteredPlans } =
    useChangePlanStatusState();
  const content = useContent();
  useChangeFlightPlanStatusFilter(preparedFlightPlans);

  if (openFilter) return <Filter />;

  return (
    <ScrollButtonsLayout
      setFilterTerm={setFilterTerm}
      buttons={<Buttons />}
      className="h-full"
    >
      <ChangeFlightPlanStatusList
        filteredPlans={filteredPlans}
        filterTerm={filterTerm}
        emptyLabel={content.nabewerking.changeFlightPlanStatus.noPlans}
      />
    </ScrollButtonsLayout>
  );
}
