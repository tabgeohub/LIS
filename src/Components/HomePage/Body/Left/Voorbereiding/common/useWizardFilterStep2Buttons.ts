import { useFilterStepWizardSelection } from "./useFilterStepWizardSelection";
import type { WizardSelectionGraphics } from "./wizardFilterStepSelection";

/** Shared Step2 filter wizard button actions for FlightPlan / TemplateFlight. */
export function useWizardFilterStep2Buttons(input: {
  setOpenFilter: (value: boolean) => void;
  selection: WizardSelectionGraphics;
  step: number;
  setStep: (value: number) => void;
  resetFilters: () => void;
  clearYellowLayers: () => void;
  buildPrevious: (clearSelectionGraphics: () => void) => () => void;
  buildCancel: (clearSelectionGraphics: () => void) => () => void;
}) {
  const { labels, withLog, clearSelectionGraphics, handleNext } =
    useFilterStepWizardSelection({
      selection: input.selection,
      step: input.step,
      setStep: input.setStep,
      resetFilters: input.resetFilters,
      clearYellowLayers: input.clearYellowLayers,
    });

  return {
    labels,
    withLog,
    setOpenFilter: input.setOpenFilter,
    handleNext,
    handlePrevious: input.buildPrevious(clearSelectionGraphics),
    handleCancel: input.buildCancel(clearSelectionGraphics),
  };
}
