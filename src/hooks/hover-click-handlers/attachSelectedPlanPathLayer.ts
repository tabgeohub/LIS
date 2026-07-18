import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapView from "@arcgis/core/views/MapView";
import {
  addPathLayerBelowPoints,
  buildPathFeatureLayer,
} from "./buildPathFeatureLayer";

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

export function attachSelectedPlanPathLayer(input: {
  mapView: MapView;
  selectedPlan: { path?: unknown };
  planPath: any[];
  pointsGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  featureLayerRef: { current: FeatureLayer | null };
  setLoadingPath: (value: boolean) => void;
}): () => void {
  input.setLoadingPath(true);
  const pathLayer = buildPathFeatureLayer({
    selectedPlan: input.selectedPlan as any,
    planPath: input.planPath,
  });
  const map = input.mapView.map!;
  input.featureLayerRef.current = pathLayer;
  addPathLayerBelowPoints({
    mapView: input.mapView,
    pathLayer,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
  });
  return () => {
    if (map.layers.includes(pathLayer)) map.remove(pathLayer);
    input.featureLayerRef.current = null;
    input.setLoadingPath(false);
  };
}
