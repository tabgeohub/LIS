import { clearMapSelectionGraphics } from "Components/HomePage/hooks/wizard/clearMapSelectionGraphics";

type SelectionGraphicsInput = {
  mapView: __esri.MapView | null;
  selectedGraphics: __esri.Graphic[];
  setSelectedGraphics: (graphics: __esri.Graphic[]) => void;
  hoveredGraphic: __esri.Graphic | null;
  setHoveredGraphic: (graphic: __esri.Graphic | null) => void;
};

type CreateFilterStepAdvanceHandlerInput = {
  step: number;
  setStep: (value: number) => void;
  resetFilters: () => void;
  selectionGraphics: SelectionGraphicsInput;
  afterAdvance?: () => void;
};

/** Shared advance flow for filter-based plan selection steps. */
export function createFilterStepAdvanceHandler(
  input: CreateFilterStepAdvanceHandlerInput
) {
  return () => {
    input.setStep(input.step + 1);
    input.resetFilters();
    clearMapSelectionGraphics(input.selectionGraphics);
    input.afterAdvance?.();
  };
}
