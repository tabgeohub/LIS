import Buttons from "./Buttons";
import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";
import Filter from "./Filter";
import CongfirmationModal from "./CongfirmationModal";
import { useContent } from "hooks/useContent";
import { useRemoveFlightPlanModel } from "./useRemoveFlightPlanModel";
import { RemoveFlightPlanList } from "./RemoveFlightPlanList";

export default function RemoveFlightPlan() {
  const model = useRemoveFlightPlanModel();
  const content = useContent();
  const emptyMessage =
    content.voorbereiding.vluchtplanVerwijderen.noPlans + " ";

  if (model.openFilter && model.plans) {
    return (
      <div className="h-full">
        <Filter plans={model.plans} />
        <CongfirmationModal refetch={model.refetch} />
      </div>
    );
  }

  return (
    <div className="h-full">
      <ScrollButtonsLayout
        setFilterTerm={model.setFilterTerm}
        className="h-full"
        buttons={<Buttons />}
      >
        <RemoveFlightPlanList
          showAllPlans={model.showAllPlans}
          setShowAllPlans={model.setShowAllPlans}
          loading={model.loading}
          allPlans={model.allPlans}
          emptyMessage={emptyMessage}
        />
      </ScrollButtonsLayout>
      <CongfirmationModal refetch={model.refetch} />
    </div>
  );
}
