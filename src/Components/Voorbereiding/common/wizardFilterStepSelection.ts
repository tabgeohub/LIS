import { clearMapSelectionGraphics } from "hooks/wizard/clearMapSelectionGraphics";
import { createFilterStepAdvanceHandler } from "./createFilterStepAdvanceHandler";

export type WizardSelectionGraphics = {
  mapView: __esri.MapView | null;
  selectedGraphics: __esri.Graphic[];
  setSelectedGraphics: (graphics: __esri.Graphic[]) => void;
  hoveredGraphic: __esri.Graphic | null;
  setHoveredGraphic: (graphic: __esri.Graphic | null) => void;
};

/** Build selection-graphics bag + clear helper used by FlightPlan / TemplateFlight Step2. */
export function createWizardSelectionGraphicsControls(
  selectionGraphics: WizardSelectionGraphics
) {
  return {
    selectionGraphics,
    clearSelectionGraphics: () => clearMapSelectionGraphics(selectionGraphics),
  };
}

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
