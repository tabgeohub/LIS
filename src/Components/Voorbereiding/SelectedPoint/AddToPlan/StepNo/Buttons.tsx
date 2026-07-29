import { usePopUpState } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";
import type { AddToPlanStepButtonsProps } from "../addToPlanStepButtonsProps";
import { AddToPlanStepButtonBar } from "../AddToPlanStepButtonBar";

export default function Buttons(props: AddToPlanStepButtonsProps) {
  const { clickedPoint } = usePopUpState();
  const logAction = useLogAction();
  const step = "Add to plan - Step no";

  return (
    <AddToPlanStepButtonBar
      {...props}
      onNext={(actions) => {
        actions.submitSelection({ addedPointIds: [clickedPoint?.id] });
        logAction({ message: "User clicked 'Add' button", step });
      }}
      onBack={(actions) => {
        actions.setStep(1);
        logAction({ message: "User clicked 'Back' button", step });
      }}
      onCancel={(actions) => {
        actions.cancelToKaartlagenlijst();
        logAction({ message: "User clicked 'Cancel' button", step });
      }}
    />
  );
}
