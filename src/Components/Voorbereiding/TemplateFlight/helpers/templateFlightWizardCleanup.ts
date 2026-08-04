import { runWizardCleanup } from "hooks/wizard/useWizardCleanup";
import {
  createWizardSelectionGraphicsControls,
  type WizardSelectionGraphics,
} from "../../common/wizardFilterStepSelection";

/** Shared clearSelectionGraphics for TemplateFlight Step2 / Step3. */
export function createTemplateFlightClearSelectionGraphics(
  selectionGraphics: WizardSelectionGraphics
) {
  return createWizardSelectionGraphicsControls(selectionGraphics)
    .clearSelectionGraphics;
}

/**
 * Run TemplateFlight wizard cleanup steps, always ending with map graphics clear.
 * Shared by Step2 / Step3 previous + cancel handlers.
 */
export function runTemplateFlightWizardCleanup(options: {
  steps: Array<() => void>;
  clearGraphics: () => void;
  clearSelectionGraphics: () => void;
}) {
  runWizardCleanup({
    actions: [
      ...options.steps,
      options.clearGraphics,
      options.clearSelectionGraphics,
    ],
  });
}

/** Previous-step cleanup shared by TemplateFlight selection steps. */
export function runTemplateFlightPreviousCleanup(input: {
  previousStep: number;
  setStep: (step: number) => void;
  resetFilters: () => void;
  clearSelectedPoints: () => void;
  clearSelectedGeometries: () => void;
  resetFeatures: () => void;
  clearGraphics: () => void;
  clearSelectionGraphics: () => void;
}) {
  runTemplateFlightWizardCleanup({
    steps: [
      () => input.setStep(input.previousStep),
      input.resetFilters,
      input.clearSelectedPoints,
      input.clearSelectedGeometries,
      input.resetFeatures,
    ],
    clearGraphics: input.clearGraphics,
    clearSelectionGraphics: input.clearSelectionGraphics,
  });
}

/** Cancel cleanup shared by TemplateFlight selection steps. */
export function runTemplateFlightCancelCleanup(input: {
  resetFeatures: () => void;
  clear: () => void;
  handleCancel: () => void;
  resetFilters: () => void;
  clearGraphics: () => void;
  clearSelectionGraphics: () => void;
  /** Step2 clears geometries before cancel; Step3 omits. */
  beforeCancel?: () => void;
  /** Step2 clears store before cancel; Step3 clears after resetFilters. */
  clearBeforeCancel?: boolean;
}) {
  const steps = input.clearBeforeCancel
    ? [
        input.resetFeatures,
        input.clear,
        ...(input.beforeCancel ? [input.beforeCancel] : []),
        input.handleCancel,
        input.resetFilters,
      ]
    : [
        input.resetFeatures,
        input.handleCancel,
        input.resetFilters,
        input.clear,
      ];

  runTemplateFlightWizardCleanup({
    steps,
    clearGraphics: input.clearGraphics,
    clearSelectionGraphics: input.clearSelectionGraphics,
  });
}
