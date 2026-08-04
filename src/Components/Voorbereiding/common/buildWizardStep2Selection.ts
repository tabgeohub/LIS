import type { WizardSelectionGraphics } from "./wizardSelectionGraphicsTypes";

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
