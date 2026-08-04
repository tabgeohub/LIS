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

  return (
    <div className="h-full ">
      {!model.openFilter && (
        <ScrollButtonsLayout
          setFilterTerm={model.setFilterTerm}
          className="h-full "
          buttons={<Buttons />}
        >
          <RemoveFlightPlanList
            showAllPlans={model.showAllPlans}
            setShowAllPlans={model.setShowAllPlans}
            loading={model.loading}
            allPlans={model.allPlans}
            emptyMessage={
              content.voorbereiding.vluchtplanVerwijderen.noPlans + " "
            }
          />
        </ScrollButtonsLayout>
      )}
      <CongfirmationModal refetch={model.refetch} />
      {model.openFilter && model.plans && <Filter plans={model.plans} />}
    </div>
  );
}
