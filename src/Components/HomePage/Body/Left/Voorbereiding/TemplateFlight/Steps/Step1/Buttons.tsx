import useLogAction from "hooks/useLogAction";
import { useTemplateFlightState } from "../../templateFlightStates";
import { useContent } from "hooks/useContent";
import { useCreateData } from "utils/useCreateData";

export default function Buttons({ name }: { name: string }) {
  const { step, setStep } = useTemplateFlightState();

  const logAction = useLogAction();

  const { create } = useCreateData("/templateFlight/templateName");

  const content = useContent();

  const handleNext = () => {
    create(
      { name },
      () => {
        setStep(step + 1);

        logAction({
          message: "User clicked 'Next' button to create a flight template",
          step: "First step",
          newData: { name },
        });
      },
      false,
      true
    );
  };

  return (
    <div className="pt-2 flex justify-end">
      <button
        disabled={name === ""}
        onClick={handleNext}
        className="gray-button"
      >
        {content.common.volgende}
      </button>
    </div>
  );
}
