import Step1 from "./Step1";
import StepYes from "./StepYes";
import StepNo from "./StepNo";
import StepMultiplePoints from "./StepMultiplePoints";

export function AddToPlanSteps(props: {
  step: number;
  answer: string;
  setAnswer: (value: string) => void;
  setStep: (value: number) => void;
}) {
  if (props.step === 1) {
    return (
      <Step1
        answer={props.answer}
        setAnswer={props.setAnswer}
        setStep={props.setStep}
      />
    );
  }
  if (props.step === 2) return <StepNo setStep={props.setStep} />;
  if (props.step === 3) return <StepYes setStep={props.setStep} />;
  if (props.step === 4) return <StepMultiplePoints setStep={props.setStep} />;
  return null;
}
