import type { TabType } from "Types";

export function createAddToPlanStep1Handlers(input: {
  answer: string;
  setAnswer: (value: string) => void;
  setStep: (value: number) => void;
  setSelectedTab: (value: TabType) => void;
  setSelectedBottomTab: (value: string) => void;
  logAction: (payload: { message: string; step: string }) => void;
}) {
  const step = "Add to plan - Step 1";
  return {
    onAnswerChange: (value: string) => {
      input.setAnswer(value);
      input.logAction({
        message:
          value === "radio1"
            ? "User clicked 'Yes' button"
            : "User clicked 'No' button",
        step,
      });
    },
    onNext: () => {
      input.setStep(input.answer === "radio2" ? 2 : 3);
      input.logAction({ message: "User clicked 'Next' button", step });
    },
    onCancel: () => {
      input.setSelectedTab("none");
      input.setSelectedBottomTab("Kaartlagenlijst");
      input.logAction({ message: "User clicked 'Cancel' button", step });
    },
  };
}
