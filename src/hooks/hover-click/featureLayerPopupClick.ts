import { createDebouncedClickGuard } from "Components/HomePage/hooks/map/mapClickGuard";
import { handleFeatureLayerMapClick } from "./featureLayerPopupClickHandler";
import type { FeatureLayerPopupData } from "./useFeatureLayerPopup";

export { handleFeatureLayerMapClick } from "./featureLayerPopupClickHandler";

export function attachFeatureLayerPopupClick(input: {
  mapView: __esri.MapView;
  clearMarker: () => void;
  createMarker: (geometry: __esri.Point) => void;
  setPopupData: (data: FeatureLayerPopupData) => void;
}) {
  const clickGuard = createDebouncedClickGuard();

  const clickHandler = input.mapView.on("click", async (event) => {
    if (clickGuard.shouldSkip()) return;

    try {
      const popup = await handleFeatureLayerMapClick({
        mapView: input.mapView,
        event,
        clearMarker: input.clearMarker,
        createMarker: input.createMarker,
      });
      input.setPopupData(popup);
    } catch (error) {
      console.error("Error handling FeatureLayer click:", error);
    } finally {
      clickGuard.finish();
    }
  });

  return () => clickHandler.remove();
}
