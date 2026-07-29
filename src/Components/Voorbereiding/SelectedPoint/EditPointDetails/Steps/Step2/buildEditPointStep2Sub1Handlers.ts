import type { EditPointMapStepProps } from "Components/HomePage/Body/Common/EditPoint/EditPointMapStepProps";
import useLogAction from "hooks/useLogAction";

export function buildEditPointStep2Sub1Handlers(input: {
  props: Pick<EditPointMapStepProps, "setSubStep" | "setStep" | "handleSubmit">;
  logAction: ReturnType<typeof useLogAction>;
}) {
  return {
    onSave: input.props.handleSubmit,
    onEnterCoordinates: () => {
      input.props.setSubStep(2);
      input.logAction({
        message: "User clicked 'Enter coordinates' button",
        step: "Edit point details - Step 2",
      });
    },
    onCancel: () => {
      input.props.setStep(1);
      input.logAction({
        message: "User clicked 'Cancel' button",
        step: "Edit point details - Step 2",
      });
    },
  };
}
