import { EnrichedPointType, FlightPlanType } from "Types";
import { useUpdateData } from "api-hooks/mutations";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";

export default function Buttons({
  setStep,
  setFase,
  selectedPlan,
  pointsData,
}: {
  setStep: (value: number) => void;
  setFase: (value: string) => void;
  selectedPlan: FlightPlanType;
  pointsData: EnrichedPointType[];
}) {
  const { labels } = useWizardButtons("Searched results - Add point");
  const { update } = useUpdateData(`/flightPlans/vluchtplans/points`);

  function handleSubmit() {
    const selectedIds = selectedPlan?.points?.map((p) => p.id) || [];
    const dataIds = pointsData.map((p) => p.id);
    const mergedIds = Array.from(new Set([...selectedIds, ...dataIds]));

    update({
      data: { points: mergedIds, id: selectedPlan?.id },
      onSuccess: () => {
        setStep(1);
        setFase("all");
      },
    });
  }

  return (
    <WizardButtonBar
      className="flex justify-end mt-4 gap-x-2 px-2"
      buttons={[
        { label: labels.toevoegen, onClick: handleSubmit },
        { label: labels.annuleren, onClick: () => setFase("all") },
      ]}
    />
  );
}
