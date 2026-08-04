import { clearMapSelectionGraphics } from "hooks/wizard/clearMapSelectionGraphics";
import type { WizardSelectionGraphics } from "./wizardSelectionGraphicsTypes";

/** Build selection-graphics bag + clear helper used by FlightPlan / TemplateFlight Step2. */
export function createWizardSelectionGraphicsControls(
  selectionGraphics: WizardSelectionGraphics
) {
  return {
    selectionGraphics,
    clearSelectionGraphics: () => clearMapSelectionGraphics(selectionGraphics),
  };
}
