import { useFilterStepWizardSelection } from "./useFilterStepWizardSelection";
import type { WizardSelectionGraphics } from "./wizardFilterStepSelection";

type WizardStep2SelectionStore = {
  selectedGraphics: __esri.Graphic[];
  setSelectedGraphics: (graphics: __esri.Graphic[]) => void;
  hoveredGraphic: __esri.Graphic | null;
  setHoveredGraphic: (graphic: __esri.Graphic | null) => void;
};

/** Build the shared Step2 selection bag from a wizard store + mapView. */
export function buildWizardStep2Selection(
  store: WizardStep2SelectionStore,
  mapView: __esri.MapView | null
): WizardSelectionGraphics {
  return {
    mapView,
    selectedGraphics: store.selectedGraphics,
    setSelectedGraphics: store.setSelectedGraphics,
    hoveredGraphic: store.hoveredGraphic,
    setHoveredGraphic: store.setHoveredGraphic,
  };
}

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
