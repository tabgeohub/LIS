export type WizardSelectionGraphics = {
  mapView: __esri.MapView | null;
  selectedGraphics: __esri.Graphic[];
  setSelectedGraphics: (graphics: __esri.Graphic[]) => void;
  hoveredGraphic: __esri.Graphic | null;
  setHoveredGraphic: (graphic: __esri.Graphic | null) => void;
};
