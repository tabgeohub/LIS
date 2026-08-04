import { useUpdateData } from "api-hooks/mutations";
import { useAddPointStates } from "Components/Voorbereiding/AddPointsVluchtPlan/useAddPointStates";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";
import WizardLoadingOverlay from "Components/Common/Wizard/WizardLoadingOverlay";

export default function Buttons() {
  const { resetFeatures } = useResetFeatures();
  const {
    selectedPoints,
    setFilteredPoints,
    setSelectedPoints,
    setSelectedPoints2,
    selectedPlan,
    selectedPoints2,
    clear,
    setStep,
    setOpenFilter,
  } = useAddPointStates();

  const handleCancel = useHandleCancel();
  const { update, loading } = useUpdateData(`/flightPlans/vluchtplans/points`);
  const { logStep, withLog, labels } = useWizardButtons("Third step");

  function handleSubmit() {
    update({
      data: {
        points: [
          ...selectedPlan?.points.flatMap((p) => p.id)!,
          ...selectedPoints,
          ...selectedPoints2,
        ],
        id: selectedPlan?.id,
      },
      onSuccess: () => {
        setStep(1);
        setSelectedPoints2([]);
        setSelectedPoints([]);
        setFilteredPoints([]);
        clear();
      },
    });
    logStep("User clicked 'Save' button");
  }

  return (
    <>
      <WizardButtonBar
        className="flex justify-end gap-x-1 text-[12px]"
        buttons={[
          {
            label: labels.vorige,
            onClick: withLog("User clicked 'Next' button", () => setStep(2)),
          },
          {
            label: labels.filteren,
            onClick: withLog("User clicked 'Filter' button", () => setOpenFilter(true)),
          },
          { label: labels.toevoegen, onClick: handleSubmit },
          {
            label: labels.annuleren,
            onClick: withLog("User clicked 'Cancel' button", () =>
              runWizardCleanup({ actions: [resetFeatures, handleCancel, clear] })
            ),
          },
        ]}
      />
      <WizardLoadingOverlay show={loading} />
    </>
  );
}
