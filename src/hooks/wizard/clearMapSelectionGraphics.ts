import type Graphic from "@arcgis/core/Graphic";
import type MapView from "@arcgis/core/views/MapView";

export type ClearMapSelectionGraphicsInput = {
  mapView: MapView | null;
  selectedGraphics: Graphic[];
  setSelectedGraphics: (graphics: Graphic[]) => void;
  hoveredGraphic: Graphic | null;
  setHoveredGraphic: (graphic: Graphic | null) => void;
};

export function clearMapSelectionGraphics(input: ClearMapSelectionGraphicsInput) {
  const {
    mapView,
    selectedGraphics,
    setSelectedGraphics,
    hoveredGraphic,
    setHoveredGraphic,
  } = input;

  selectedGraphics.forEach((graphic) => mapView?.graphics.remove(graphic));
  setSelectedGraphics([]);

  if (hoveredGraphic) {
    mapView?.graphics.remove(hoveredGraphic);
    setHoveredGraphic(null);
  }
}
