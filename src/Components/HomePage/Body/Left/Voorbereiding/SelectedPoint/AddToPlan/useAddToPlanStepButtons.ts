import { useUpdateData } from "utils/useUpdateData";
import type { AddToPlanStepButtonsProps } from "./addToPlanStepButtonsProps";
import { useAddToPlanWizardNavigation } from "./addToPlanWizardNavigation";
import { submitAddToPlanSelection } from "./submitAddToPlanSelection";

type SubmitSelectionInput = {
  addedPointIds: Array<number | null | undefined>;
  afterSubmit?: () => void;
  onSuccess?: () => void;
};

/** Shared props + navigation + submit wiring for AddToPlan step button bars. */
export function useAddToPlanStepButtons(props: AddToPlanStepButtonsProps) {
  const { setSubStep, setStep, selectedPlan } = props;
  const { cancelToKaartlagenlijst, setSelectedBottomTab } =
    useAddToPlanWizardNavigation();
  const { update } = useUpdateData(`/flightPlans/vluchtplans/points`);

  return {
    setStep,
    cancelToKaartlagenlijst,
    submitSelection: (input: SubmitSelectionInput) =>
      submitAddToPlanSelection({
        selectedPlan,
        setSubStep,
        update,
        addedPointIds: input.addedPointIds,
        afterSubmit: input.afterSubmit,
        onSuccess:
          input.onSuccess ?? (() => setSelectedBottomTab("Kaartlagenlijst")),
      }),
  };
}
