import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import FlightPlanPickerList from "Components/HomePage/Body/Common/EditPoint/FlightPlanPickerList";
import useLogAction from "hooks/useLogAction";
import { FlightPlanType } from "Types";

export default function PlansList({
  plans,
  selectedPlan,
  setSelectedPlan,
  setStep,
}: {
  plans: FlightPlanType[];
  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (value: FlightPlanType | null) => void;
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();

  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  return (
    <FlightPlanPickerList
      plans={plans}
      selectedPlan={selectedPlan}
      showFinishedBadge
      onSelectPlan={(plan) => {
        setSelectedPlan(plan);

        logAction({
          message: "User clicked a plan",
          step: "View plans",
        });
      }}
      footerButtons={
        <>
          <button
            onClick={() => {
              setStep(2);

              logAction({
                message: "User clicked 'Next' button",
                step: "View plans",
              });
            }}
            disabled={!selectedPlan}
            className="gray-button"
          >
            Volgende
          </button>

          <button
            onClick={() => {
              setSelectedTab("none");
              setSelectedBottomTab("Kaartlagenlijst");

              logAction({
                message: "User clicked 'Cancel' button",
                step: "View plans",
              });
            }}
            className="gray-button"
          >
            Annuleren
          </button>
        </>
      }
    />
  );
}
