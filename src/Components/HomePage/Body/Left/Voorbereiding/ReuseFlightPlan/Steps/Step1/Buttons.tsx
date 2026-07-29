import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useHandleCancel } from "Components/HomePage/hooks/handleCancel/useHandleCancel";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "Components/HomePage/hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";

export default function Buttons() {
  const { graphicsLayer } = useMapViewState();
  const { setOpenFilter, clear, setStep, selectedPlan } = useReuseFlightPlan();
  const handleCancel = useHandleCancel();
  const { withLog, labels, content } = useWizardButtons("First step");

  function handleNext() {
    if (!graphicsLayer) return;
    graphicsLayer.graphics.removeAll();
    setStep(2);
  }

  return (
    <WizardButtonBar
      className=""
      buttons={[
        {
          label: labels.filteren,
          onClick: withLog(
            "User clicked 'Filter' button",
            () => setOpenFilter(true)
          ),
        },
        {
          label: content.voorbereiding.vluchtplanHergebruiken.step1.kopieerVluchtplan,
          disabled: !selectedPlan,
          onClick: withLog("User clicked 'Next' button", handleNext),
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", () =>
            runWizardCleanup({ actions: [() => handleCancel(), clear] })
          ),
        },
      ]}
    />
  );
}
