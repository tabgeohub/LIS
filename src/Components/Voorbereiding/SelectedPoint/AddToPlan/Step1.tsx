import AddToPlanQuestionStep from "Components/Common/EditPoint/AddToPlanQuestionStep";
import { useSelectedBottomTabState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";
import { createAddToPlanStep1Handlers } from "./createAddToPlanStep1Handlers";

type Step1Props = {
  answer: string;
  setAnswer: (value: string) => void;
  setStep: (value: number) => void;
};

export default function Step1({ answer, setAnswer, setStep }: Step1Props) {
  const logAction = useLogAction();
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const handlers = createAddToPlanStep1Handlers({
    answer,
    setAnswer,
    setStep,
    setSelectedTab,
    setSelectedBottomTab,
    logAction,
  });

  return (
    <AddToPlanQuestionStep
      question="Wilt u meer dan één punt toevoegen aan een vluchtplan?"
      yesLabel="Ja"
      noLabel="Nee"
      nextLabel="Volgende"
      cancelLabel="Annuleren"
      answer={answer}
      onAnswerChange={handlers.onAnswerChange}
      onNext={handlers.onNext}
      onCancel={handlers.onCancel}
      radioName="voorbereidingAddToPlan"
    />
  );
}
