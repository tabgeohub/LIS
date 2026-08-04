import { createFilterStepAdvanceHandler } from "./createFilterStepAdvanceHandler";
import type { WizardSelectionGraphics } from "./wizardSelectionGraphicsTypes";

export function createWizardFilterStepNext(input: {
  step: number;
  setStep: (value: number) => void;
  resetFilters: () => void;
  selectionGraphics: WizardSelectionGraphics;
  clearYellowLayers: () => void;
}) {
  return createFilterStepAdvanceHandler({
    step: input.step,
    setStep: input.setStep,
    resetFilters: input.resetFilters,
    selectionGraphics: input.selectionGraphics,
    afterAdvance: input.clearYellowLayers,
  });
}
