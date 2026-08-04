import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { FinishedFlightPlanType } from "Types/finished_plans";

export function isPathLayerReady(
  featureLayer: FeatureLayer | null,
  mapView: __esri.MapView | null | undefined
) {
  return !!(
    featureLayer &&
    mapView?.map?.layers.includes(featureLayer)
  );
}

export function buildPathLoadingReadyInput(input: {
  loadingPath: boolean;
  setLoadingPath: (value: boolean) => void;
  finishedPlanLoading: boolean;
  selectedPlan: FinishedFlightPlanType | null | undefined;
  pathLayerReady: boolean;
  pointsGraphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  const path = input.selectedPlan?.path;
  const pointsData = input.selectedPlan?.points_data;

  return {
    loadingPath: input.loadingPath,
    setLoadingPath: input.setLoadingPath,
    finishedPlanLoading: input.finishedPlanLoading,
    hasPath: !!path && Array.isArray(path) && path.length > 0,
    pathLayerReady: input.pathLayerReady,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    expectedPointsCount: Array.isArray(pointsData) ? pointsData.length : 0,
  };
}
