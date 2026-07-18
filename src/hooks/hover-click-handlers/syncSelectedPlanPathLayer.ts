import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapView from "@arcgis/core/views/MapView";
import {
  attachSelectedPlanPathLayer,
  clearPathFeatureLayer,
} from "./attachSelectedPlanPathLayer";

export { clearPathFeatureLayer };

/** Build/replace the selected plan path layer; returns cleanup. */
export function syncSelectedPlanPathLayer(input: {
  mapView: MapView | null | undefined;
  selectedPlan: { path?: unknown } | null | undefined;
  pointsGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  featureLayerRef: { current: FeatureLayer | null };
  setLoadingPath: (value: boolean) => void;
}): (() => void) | undefined {
  clearPathFeatureLayer({
    mapView: input.mapView,
    featureLayer: input.featureLayerRef.current,
  });
  input.featureLayerRef.current = null;

  if (!input.selectedPlan || !input.mapView?.map) {
    input.setLoadingPath(false);
    return;
  }

  const planPath = input.selectedPlan.path;
  if (!planPath || !Array.isArray(planPath) || planPath.length === 0) {
    input.setLoadingPath(false);
    return;
  }

  return attachSelectedPlanPathLayer({
    mapView: input.mapView,
    selectedPlan: input.selectedPlan,
    planPath,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    featureLayerRef: input.featureLayerRef,
    setLoadingPath: input.setLoadingPath,
  });
}
