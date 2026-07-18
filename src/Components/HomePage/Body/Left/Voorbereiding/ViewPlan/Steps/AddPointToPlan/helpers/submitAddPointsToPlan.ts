import { applyAddPointsToPlanSuccess } from "./applyAddPointsToPlanSuccess";
import { prepareAddPointsToPlanPayload } from "./prepareAddPointsToPlanPayload";
import type { SubmitAddPointsToPlanInput } from "./submitAddPointsToPlanTypes";

export type { SubmitAddPointsToPlanInput } from "./submitAddPointsToPlanTypes";

export function submitAddPointsToPlan(input: SubmitAddPointsToPlanInput) {
  const prepared = prepareAddPointsToPlanPayload(input);
  input.update({
    data: { points: prepared.uniquePointIds, id: input.selectedPlan.id },
    onSuccess: () =>
      applyAddPointsToPlanSuccess({
        ...input,
        ...prepared,
      }),
  });
}
