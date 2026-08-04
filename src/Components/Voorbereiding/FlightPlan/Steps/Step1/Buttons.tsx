import useLogAction from "hooks/useLogAction";
import { useFlightPlanState } from "Components/Voorbereiding/FlightPlan/useFlightPlanState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { vluchtnummerRegex } from "@constants/vluchtnummerRegex";
import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import WizardButtonBar from "Components/Common/Wizard/WizardButtonBar";

export default function Buttons() {
  const { vluchtnummer, waarnemer, datum, setStep, clear } = useFlightPlanState();
  const handleCancel = useHandleCancel();
  const { withLog, labels } = useWizardButtons("First step");

  return (
    <WizardButtonBar
      className="flex justify-end gap-x-1 text-[12px] mt-6"
      buttons={[
        {
          label: labels.volgende,
          disabled: !vluchtnummer || !vluchtnummerRegex.test(vluchtnummer) || !waarnemer || !datum,
          onClick: withLog("User clicked 'Next' button", () => setStep(2)),
        },
        {
          label: labels.annuleren,
          onClick: withLog("User clicked 'Cancel' button", () =>
            runWizardCleanup({ actions: [() => handleCancel(clear)] })
          ),
        },
      ]}
    />
  );
}
