import FlightPlanPickerList from "Components/HomePage/Body/Common/EditPoint/FlightPlanPickerList";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { FlightPlanType } from "Types";

export default function PlansList({
  plans,
  selectedPlan,
  setSelectedPlan,
  setStep,
  step,
}: {
  plans: FlightPlanType[];
  selectedPlan: FlightPlanType | null;
  setSelectedPlan: (value: FlightPlanType | null) => void;
  setStep: (value: number) => void;
  step: number;
}) {
  const { setMainStep } = useDeletePointState();
  const logAction = useLogAction();

  return (
    <FlightPlanPickerList
      plans={plans}
      selectedPlan={selectedPlan}
      additionalInfoLabel="Aanvullende Informatie"
      filterResetDeps={[plans, step]}
      onSelectPlan={(plan) => setSelectedPlan(plan)}
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
              setMainStep("main");

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
