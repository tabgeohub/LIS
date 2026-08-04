import { useWizardButtons } from "hooks/wizard/useWizardButtons";
import { createWizardFilterStepNext } from "./createWizardFilterStepNext";
import { createWizardSelectionGraphicsControls } from "./createWizardSelectionGraphicsControls";
import type { WizardSelectionGraphics } from "./wizardSelectionGraphicsTypes";

/** Shared Step2 selection + next wiring for FlightPlan / TemplateFlight. */
export function useFilterStepWizardSelection(input: {
  selection: WizardSelectionGraphics;
  step: number;
  setStep: (value: number) => void;
  resetFilters: () => void;
  clearYellowLayers: () => void;
}) {
  const { withLog, labels } = useWizardButtons("Second step");
  const { selectionGraphics, clearSelectionGraphics } =
    createWizardSelectionGraphicsControls(input.selection);

  return {
    labels,
    withLog,
    clearSelectionGraphics,
    handleNext: createWizardFilterStepNext({
      step: input.step,
      setStep: input.setStep,
      resetFilters: input.resetFilters,
      selectionGraphics,
      clearYellowLayers: input.clearYellowLayers,
    }),
  };
}
