import { useHandleCancel } from "hooks/handleCancel/useHandleCancel";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useAddPointStates } from "hooks/zustand/useAddPointStates";
import { useResetFeatures } from "hooks/features/useResetFeatures";

export default function Buttons() {
  const { resetFeatures } = useResetFeatures();
  const logAction = useLogAction();

  const { setOpenFilter, clear, setStep } = useAddPointStates();
  const handleCancel = useHandleCancel();

  function handleNext() {
    setStep(3);
  }

  const content = useContent();

  return (
    <div className="flex justify-end gap-x-1 text-[12px]">
      <button
        onClick={() => {
          setStep(1);

          logAction({
            message: "User clicked 'Previous' button",
            step: "Second step",
          });
        }}
        className="gray-button"
      >
        {content.common.vorige}
      </button>

      <button
        onClick={() => {
          setOpenFilter(true);
          logAction({
            message: "User clicked 'Filter' button",
            step: "Second step",
          });
        }}
        className="gray-button"
      >
        {content.common.filteren}
      </button>

      <button
        onClick={() => {
          handleNext();

          logAction({
            message: "User clicked 'Next' button",
            step: "Second step",
          });
        }}
        className="gray-button"
      >
        {content.common.volgende}
      </button>

      <button
        onClick={() => {
          resetFeatures();

          handleCancel();
          clear();

          logAction({
            message: "User clicked 'Cancel' button",
            step: "Second step",
          });
        }}
        className="gray-button"
      >
        {content.common.annuleren}
      </button>
    </div>
  );
}
