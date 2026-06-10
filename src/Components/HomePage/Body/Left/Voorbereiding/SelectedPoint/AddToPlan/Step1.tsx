import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import AddToPlanQuestionStep from "Components/HomePage/Body/Common/EditPoint/AddToPlanQuestionStep";
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
    <AddToPlanQuestionStep
      question="Wilt u meer dan één punt toevoegen aan een vluchtplan?"
      yesLabel="Ja"
      noLabel="Nee"
      nextLabel="Volgende"
      cancelLabel="Annuleren"
      answer={answer}
      onAnswerChange={(value) => {
        setAnswer(value);

        logAction({
          message:
            value === "radio1"
              ? "User clicked 'Yes' button"
              : "User clicked 'No' button",
          step: "Add to plan - Step 1",
        });
      }}
      onNext={() => {
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
      onCancel={() => {
        setSelectedTab("none");
        setSelectedBottomTab("Kaartlagenlijst");

        logAction({
          message: "User clicked 'Cancel' button",
          step: "Add to plan - Step 1",
        });
      }}
      radioName="voorbereidingAddToPlan"
    />
  );
}
