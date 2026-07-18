import useLogAction from "hooks/useLogAction";
import type { EditPointMapStepProps } from "Components/HomePage/Body/Common/EditPoint/EditPointMapStepProps";

export function buildDeletePointStep2Sub1Handlers(
  props: EditPointMapStepProps,
  logAction: ReturnType<typeof useLogAction>
) {
  return {
    onSave: () => {
      props.handleSubmit();
      logAction({
        message: "User clicked 'Save' button",
        step: "Edit point details - Step 2",
      });
    },
    onEnterCoordinates: () => {
      props.setSubStep(2);
      logAction({
        message: "User clicked 'Edit geometry' button",
        step: "Edit point details - Step 2",
      });
    },
    onCancel: () => {
      props.setStep(1);
      logAction({
        message: "User clicked 'Back' button",
        step: "Edit point details - Step 2",
      });
    },
  };
}
