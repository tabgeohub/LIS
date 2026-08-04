import { useDeletePointState } from "Components/HomePageTools/AandachtspuntenVerwijderen/state/useDeletePointState";
import { FlightPlanType } from "Types";
import { useUpdateData } from "api-hooks/mutations";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";

export default function Buttons({
  setSubStep,
  selectedPlan,
}: {
  setSubStep: (step: number) => void;
  selectedPlan: FlightPlanType;
}) {
  const { withLog, logStep, labels } = useWizardButtons("Add to plan - Step no");
  const { setSelectedPoint, setMainStep, selectedPoint } = useDeletePointState();
  const { update } = useUpdateData(`/flightPlans/vluchtplans/points`);

  function handleSubmit() {
    update({
      data: {
        id: selectedPlan.id,
        points: [
          ...selectedPlan.points.flatMap((point) => point.id),
          selectedPoint?.id,
        ],
      },
      onSuccess: () => setSubStep(2),
    });

    logStep("User clicked 'Save' button", { point: selectedPoint?.omschrijving });
  }

  return (
    <WizardButtonBar
      className="flex justify-end gap-x-1 text-[12px] mr-4 mb-0"
      buttons={[
        {
          label: labels.volgende,
          onClick: handleSubmit,
          disabled: selectedPlan === null,
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", () => {
            setMainStep("main");
            setSelectedPoint(null);
          }),
        },
      ]}
    />
  );
}
