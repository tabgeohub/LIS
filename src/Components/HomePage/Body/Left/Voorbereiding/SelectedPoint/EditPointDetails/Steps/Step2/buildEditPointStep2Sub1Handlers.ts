import type { EditPointMapStepProps } from "Components/HomePage/Body/Common/EditPoint/EditPointMapStepProps";
import useLogAction from "hooks/useLogAction";

export function buildEditPointStep2Sub1Handlers(
  props: Pick<EditPointMapStepProps, "setSubStep" | "setStep" | "handleSubmit">,
  logAction: ReturnType<typeof useLogAction>
) {
  return {
    onSave: props.handleSubmit,
    onEnterCoordinates: () => {
      props.setSubStep(2);
      logAction({
        message: "User clicked 'Enter coordinates' button",
        step: "Edit point details - Step 2",
      });
    },
    onCancel: () => {
      props.setStep(1);
      logAction({
        message: "User clicked 'Cancel' button",
        step: "Edit point details - Step 2",
      });
    },
  };
}
