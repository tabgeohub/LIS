import { useTemplateFlightState } from "../../templateFlightStates";
import { useCreateData } from "api-hooks/mutations";
import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { useWizardButtons } from "Components/HomePage/hooks/wizard/useWizardButtons";

export default function Buttons({ name }: { name: string }) {
  const { logStep, labels } = useWizardButtons("First step");
  const { step, setStep } = useTemplateFlightState();
  const { create } = useCreateData("/templateFlight/templateName");

  const handleNext = () => {
    create({
      data: { name },
      onSuccess: () => {
        setStep(step + 1);
        logStep("User clicked 'Next' button to create a flight template", { name });
      },
      disableErrorMessage: true,
      disableSuccessMessage: true,
    });
  };

  return (
    <WizardButtonBar
      className="pt-2 flex justify-end"
      buttons={[
        { label: labels.volgende, onClick: handleNext, disabled: name === "" },
      ]}
    />
  );
}
