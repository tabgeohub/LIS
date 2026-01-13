import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import useLogAction from "hooks/useLogAction";

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

  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  return (
    <div className="p-2">
      <p className="text-[12px]">
        Wilt u meer dan één punt toevoegen aan een vluchtplan?
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
          <label htmlFor="radio1">Ja</label>
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
          <label htmlFor="radio2">Nee</label>
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
          Volgende
        </button>

        <button
          onClick={() => {
            setSelectedTab("none");
            setSelectedBottomTab("Kaartlagenlijst");

            logAction({
              message: "User clicked 'Cancel' button",
              step: "Add to plan - Step 1",
            });
          }}
          className="gray-button"
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}
