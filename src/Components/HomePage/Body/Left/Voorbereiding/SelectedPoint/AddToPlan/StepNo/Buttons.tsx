import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import useLogAction from "hooks/useLogAction";
import type { AddToPlanStepButtonsProps } from "../addToPlanStepButtonsProps";
import { AddToPlanWizardButtonBar } from "../AddToPlanWizardButtonBar";
import { useAddToPlanStepButtons } from "../useAddToPlanStepButtons";

export default function Buttons(props: AddToPlanStepButtonsProps) {
  const { setStep, cancelToKaartlagenlijst, submitSelection } =
    useAddToPlanStepButtons(props);
  const { clickedPoint } = usePopUpState();
  const logAction = useLogAction();

  function handleSubmit() {
    submitSelection({ addedPointIds: [clickedPoint?.id] });
    logAction({
      message: "User clicked 'Add' button",
      step: "Add to plan - Step no",
    });
  }

  return (
    <AddToPlanWizardButtonBar
      onBack={() => {
        setStep(1);
        logAction({
          message: "User clicked 'Back' button",
          step: "Add to plan - Step no",
        });
      }}
      onNext={handleSubmit}
      onCancel={() => {
        cancelToKaartlagenlijst();
        logAction({
          message: "User clicked 'Cancel' button",
          step: "Add to plan - Step no",
        });
      }}
    />
  );
}
