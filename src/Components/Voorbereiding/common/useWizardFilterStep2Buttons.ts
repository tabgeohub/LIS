import { useFilterStepWizardSelection } from "./useFilterStepWizardSelection";
import type { WizardSelectionGraphics } from "./wizardSelectionGraphicsTypes";
import { buildWizardStep2Selection } from "./buildWizardStep2Selection";

export { buildWizardStep2Selection } from "./buildWizardStep2Selection";

type WizardStep2Store = {
  selectedGraphics: __esri.Graphic[];
  setSelectedGraphics: (graphics: __esri.Graphic[]) => void;
  hoveredGraphic: __esri.Graphic | null;
  setHoveredGraphic: (graphic: __esri.Graphic | null) => void;
  step: number;
  setStep: (value: number) => void;
};

/** Shared Step2 filter wizard button actions for FlightPlan / TemplateFlight. */
export function useWizardFilterStep2Buttons(input: {
  setOpenFilter: (value: boolean) => void;
  store: WizardStep2Store;
  mapView: __esri.MapView | null;
  resetFilters: () => void;
  clearYellowLayers: () => void;
  buildPrevious: (clearSelectionGraphics: () => void) => () => void;
  buildCancel: (clearSelectionGraphics: () => void) => () => void;
}) {
  const selection: WizardSelectionGraphics = buildWizardStep2Selection(
    input.store,
    input.mapView
  );
  const { labels, withLog, clearSelectionGraphics, handleNext } =
    useFilterStepWizardSelection({
      selection,
      step: input.store.step,
      setStep: input.store.setStep,
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
