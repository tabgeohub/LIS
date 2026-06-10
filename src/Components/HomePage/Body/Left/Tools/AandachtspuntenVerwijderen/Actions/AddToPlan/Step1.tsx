import AddToPlanQuestionStep from "Components/HomePage/Body/Common/EditPoint/AddToPlanQuestionStep";
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
  const content = useContent();

  const { setMainStep } = useDeletePointState();

  return (
    <AddToPlanQuestionStep
      question={content.tools.aandachtspuntenVerwijderen.addToPlan.title}
      yesLabel={content.tools.aandachtspuntenVerwijderen.addToPlan.ja}
      noLabel={content.tools.aandachtspuntenVerwijderen.addToPlan.nee}
      nextLabel={content.common.volgende}
      cancelLabel={content.common.annuleren}
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
        setMainStep("main");

        logAction({
          message: "User clicked 'Cancel' button",
          step: "Add to plan - Step 1",
        });
      }}
      radioName="toolsAddToPlan"
    />
  );
}
