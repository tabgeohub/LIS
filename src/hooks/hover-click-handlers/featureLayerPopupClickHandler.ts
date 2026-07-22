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
