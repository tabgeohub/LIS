/* eslint-disable react-hooks/exhaustive-deps */
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useEffect, useRef, useState } from "react";
import usePathPointHandlerClick from "./usePathPointHandlerClick";
import { usePathLoadingReady } from "./usePathLoadingReady";
import { syncSelectedPlanPathLayer } from "./syncSelectedPlanPathLayer";
import {
  buildPathLoadingReadyInput,
  isPathLayerReady,
} from "./pathLoadingReadyInput";

export default function useDrawPath(finishedPlanLoading: boolean = false) {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, redGraphicsLayer, pointsGraphicsLayer } = useMapViewState();
  const [loadingPath, setLoadingPath] = useState(false);
  const featureLayerRef = useRef<FeatureLayer | null>(null);

  usePathPointHandlerClick();

  useEffect(
    () =>
      syncSelectedPlanPathLayer({
        mapView,
        selectedPlan,
        pointsGraphicsLayer,
        featureLayerRef,
        setLoadingPath,
      }),
    [mapView, redGraphicsLayer, selectedPlan, pointsGraphicsLayer]
  );

  usePathLoadingReady(
    buildPathLoadingReadyInput({
      loadingPath,
      setLoadingPath,
      finishedPlanLoading,
      selectedPlan,
      pathLayerReady: isPathLayerReady(featureLayerRef.current, mapView),
      pointsGraphicsLayer,
    })
  );

  return { loadingPath };
}
