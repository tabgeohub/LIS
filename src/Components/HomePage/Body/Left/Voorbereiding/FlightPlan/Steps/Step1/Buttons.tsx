import useLogAction from "hooks/useLogAction";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";
import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { vluchtnummerRegex } from "@constants/vluchtnummerRegex";
import { useContent } from "hooks/useContent";

export default function Buttons() {
  const { vluchtnummer, waarnemer, datum, setStep, clear } =
    useFlightPlanState();

  const handleCancel = useHandleCancel();

  function handleNext() {
    setStep(2);
  }

  const logAction = useLogAction();

  const content = useContent();

  return (
    <div className="flex justify-end gap-x-1 text-[12px] mt-6">
      <button
        disabled={
          !vluchtnummer ||
          !vluchtnummerRegex.test(vluchtnummer) ||
          !waarnemer ||
          !datum
        }
        onClick={() => {
          handleNext();

          logAction({
            message: "User clicked 'Next' button",
            step: "First step",
          });
        }}
        className="gray-button"
      >
        {content.common.volgende}
      </button>

      <button
        onClick={() => {
          handleCancel(clear);

          logAction({
            message: "User clicked 'Cancel' button",
            step: "First step",
          });
        }}
        className="gray-button"
      >
        {content.common.annuleren}
      </button>
    </div>
  );
}
