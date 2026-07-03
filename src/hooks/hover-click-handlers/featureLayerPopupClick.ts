import { createDebouncedClickGuard } from "hooks/map/mapClickGuard";
import {
  findTargetFeatureHit,
  resolveFeaturePopupData,
} from "./featureLayerPopupResolve";
import type { FeatureLayerPopupData } from "./useFeatureLayerPopup";

export async function handleFeatureLayerMapClick(input: {
  mapView: __esri.MapView;
  event: __esri.ViewClickEvent;
  clearMarker: () => void;
  createMarker: (geometry: __esri.Point) => void;
}): Promise<FeatureLayerPopupData> {
  const response = await input.mapView.hitTest(input.event);
  const targetFeature = findTargetFeatureHit(response.results);

  if (!targetFeature?.graphic) {
    input.clearMarker();
    return null;
  }

  const graphic = targetFeature.graphic;
  const layer = graphic.layer as __esri.FeatureLayer;
  const geometry = graphic.geometry as __esri.Point;
  const screenPoint = input.mapView.toScreen(input.event.mapPoint);
  if (!geometry || !screenPoint || !layer.title) return null;

  const popup = await resolveFeaturePopupData({
    layer,
    attributes: graphic.attributes,
    geometry,
    screenPoint: { x: screenPoint.x, y: screenPoint.y },
  });

  input.createMarker(geometry);
  return popup;
}

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
