/* eslint-disable react-hooks/exhaustive-deps */
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useEffect, useRef, useState } from "react";
import usePathPointHandlerClick from "./usePathPointHandlerClick";
import {
  addPathLayerBelowPoints,
  buildPathFeatureLayer,
} from "./buildPathFeatureLayer";
import { usePathLoadingReady } from "./usePathLoadingReady";

export default function useDrawPath(finishedPlanLoading: boolean = false) {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, redGraphicsLayer, pointsGraphicsLayer } = useMapViewState();
  const [loadingPath, setLoadingPath] = useState(false);
  const featureLayerRef = useRef<FeatureLayer | null>(null);

  usePathPointHandlerClick();

  useEffect(() => {
    if (featureLayerRef.current && mapView?.map) {
      if (mapView.map.layers.includes(featureLayerRef.current)) {
        mapView.map.remove(featureLayerRef.current);
      }
      featureLayerRef.current = null;
    }

    if (!selectedPlan || !mapView?.map) {
      setLoadingPath(false);
      return;
    }

    const planPath = selectedPlan.path;
    if (!planPath || !Array.isArray(planPath) || planPath.length === 0) {
      setLoadingPath(false);
      return;
    }

    setLoadingPath(true);
    const pathLayer = buildPathFeatureLayer({ selectedPlan, planPath });
    const map = mapView.map;
    featureLayerRef.current = pathLayer;
    addPathLayerBelowPoints({ mapView, pathLayer, pointsGraphicsLayer });

    return () => {
      if (map.layers.includes(pathLayer)) {
        map.remove(pathLayer);
      }
      featureLayerRef.current = null;
      setLoadingPath(false);
    };
  }, [mapView, redGraphicsLayer, selectedPlan, pointsGraphicsLayer]);

  const pathLayerReady = !!(
    featureLayerRef.current &&
    mapView?.map?.layers.includes(featureLayerRef.current)
  );

  usePathLoadingReady({
    loadingPath,
    setLoadingPath,
    finishedPlanLoading,
    hasPath: !!selectedPlan?.path && Array.isArray(selectedPlan.path) && selectedPlan.path.length > 0,
    pathLayerReady,
    pointsGraphicsLayer,
    expectedPointsCount: Array.isArray(selectedPlan?.points_data)
      ? selectedPlan.points_data.length
      : 0,
  });

  return { loadingPath };
}
