import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapView from "@arcgis/core/views/MapView";
import {
  addPathLayerBelowPoints,
  buildPathFeatureLayer,
} from "./buildPathFeatureLayer";

type SelectedPlanWithPath = {
  path?: unknown;
  [key: string]: unknown;
};

export function clearPathFeatureLayer(input: {
  mapView: MapView | null | undefined;
  featureLayer: FeatureLayer | null;
}) {
  if (input.featureLayer && input.mapView?.map) {
    if (input.mapView.map.layers.includes(input.featureLayer)) {
      input.mapView.map.remove(input.featureLayer);
    }
  }
}

/** Build/replace the selected plan path layer; returns cleanup. */
export function syncSelectedPlanPathLayer(input: {
  mapView: MapView | null | undefined;
  selectedPlan: SelectedPlanWithPath | null | undefined;
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

  input.setLoadingPath(true);
  const pathLayer = buildPathFeatureLayer({
    selectedPlan: input.selectedPlan as any,
    planPath,
  });
  const map = input.mapView.map;
  input.featureLayerRef.current = pathLayer;
  addPathLayerBelowPoints({
    mapView: input.mapView,
    pathLayer,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
  });

  return () => {
    if (map.layers.includes(pathLayer)) {
      map.remove(pathLayer);
    }
    input.featureLayerRef.current = null;
    input.setLoadingPath(false);
  };
}
