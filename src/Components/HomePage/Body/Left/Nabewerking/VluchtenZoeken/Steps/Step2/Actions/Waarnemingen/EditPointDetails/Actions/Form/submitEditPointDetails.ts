import {
  applyEditPointDetailsSuccess,
  buildEditPointDetailsPayload,
} from "./editPointDetailsUpdate";
import type { SubmitEditPointDetailsInput } from "./submitEditPointDetailsTypes";

export function submitEditPointDetails(input: SubmitEditPointDetailsInput) {
  if (!input.selectedPoint) return;
  const payload = buildEditPointDetailsPayload({
    selectedPoint: input.selectedPoint,
    omschrijving: input.omschrijving,
    comment: input.comment,
  });
  input.update({
    data: payload,
    onSuccess: (responseData) => {
      if (!responseData.result || !input.selectedPlan || !input.selectedPoint)
        return;
      applyEditPointDetailsSuccess({
        ...input,
        selectedPoint: input.selectedPoint,
        selectedPlan: input.selectedPlan,
        payload,
      });
    },
  });
  input.logAction({
    message: "User clicked 'Update' button",
    step: "Second step - Edit point",
    newData: { ...payload },
  });
}
