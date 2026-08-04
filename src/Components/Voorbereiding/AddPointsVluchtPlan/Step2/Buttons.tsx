import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useAddPointStates } from "Components/Voorbereiding/AddPointsVluchtPlan/useAddPointStates";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";

export default function Buttons() {
  const { resetFeatures } = useResetFeatures();
  const { setOpenFilter, clear, setStep } = useAddPointStates();
  const handleCancel = useHandleCancel();
  const { withLog, labels } = useWizardButtons("Second step");

  return (
    <WizardButtonBar
      className="flex justify-end gap-x-1 text-[12px]"
      buttons={[
        {
          label: labels.vorige,
          onClick: withLog("User clicked 'Previous' button", () => setStep(1)),
        },
        {
          label: labels.filteren,
          onClick: withLog("User clicked 'Filter' button", () => setOpenFilter(true)),
        },
        {
          label: labels.volgende,
          onClick: withLog("User clicked 'Next' button", () => setStep(3)),
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", () =>
            runWizardCleanup({ actions: [resetFeatures, handleCancel, clear] })
          ),
        },
      ]}
    />
  );
}
