import type { FlightPlanType } from "Types";

type SubmitAddToPlanSelectionInput = {
  selectedPlan: FlightPlanType | null;
  addedPointIds: Array<number | null | undefined>;
  setSubStep: (step: number) => void;
  update: (input: {
    data: { id: number; points: number[] };
    onSuccess?: () => void;
  }) => void;
  onSuccess?: () => void;
  afterSubmit?: () => void;
};

/** Shared submit flow for AddToPlan step buttons. */
export function submitAddToPlanSelection(
  input: SubmitAddToPlanSelectionInput
) {
  if (input.selectedPlan === null) return;

  const pointIds = Array.from(
    new Set([
      ...input.selectedPlan.points.map((point) => point.id),
      ...input.addedPointIds.filter(
        (id): id is number => typeof id === "number"
      ),
    ])
  );

  input.setSubStep(2);
  input.update({
    data: {
      id: input.selectedPlan.id,
      points: pointIds,
    },
    onSuccess: input.onSuccess,
  });

  input.afterSubmit?.();
}
