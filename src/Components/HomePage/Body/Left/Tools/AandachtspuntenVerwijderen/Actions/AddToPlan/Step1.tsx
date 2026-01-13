import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";

export default function Step1({
  answer,
  setAnswer,
  setStep,
}: {
  answer: string;
  setAnswer: (value: string) => void;
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();

  const { setMainStep } = useDeletePointState();

  const content = useContent();

  return (
    <div className="p-2">
      <p className="text-[12px]">
        {content.tools.aandachtspuntenVerwijderen.addToPlan.title}
      </p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-x-2 text-sm">
          <input
            onClick={() => {
              setAnswer("radio1");
              logAction({
                message: "User clicked 'Yes' button",
                step: "Add to plan - Step 1",
              });
            }}
            checked={answer === "radio1"}
            type="radio"
            id="radio1"
            name="radio"
          />
          <label htmlFor="radio1">
            {content.tools.aandachtspuntenVerwijderen.addToPlan.ja}
          </label>
        </div>

        <div className="flex items-center gap-x-2 text-sm">
          <input
            onClick={() => {
              setAnswer("radio2");

              logAction({
                message: "User clicked 'No' button",
                step: "Add to plan - Step 1",
              });
            }}
            checked={answer === "radio2"}
            type="radio"
            id="radio2"
            name="radio"
          />
          <label htmlFor="radio2">
            {content.tools.aandachtspuntenVerwijderen.addToPlan.nee}
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button
          onClick={() => {
            if (answer === "radio2") {
              setStep(2);
            } else {
              setStep(3);
            }

            logAction({
              message: "User clicked 'Next' button",
              step: "Add to plan - Step 1",
            });
          }}
          className="gray-button"
        >
          {content.common.volgende}
        </button>

        <button
          onClick={() => {
            setMainStep("main");

            logAction({
              message: "User clicked 'Cancel' button",
              step: "Add to plan - Step 1",
            });
          }}
          className="gray-button"
        >
          {content.common.annuleren}
        </button>
      </div>
    </div>
  );
}
