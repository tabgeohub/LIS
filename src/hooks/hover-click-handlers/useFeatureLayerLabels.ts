import { useEffect, useRef } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { attachFeatureLayerLabelSync } from "./featureLayerLabelsSync";

export default function useFeatureLayerLabels() {
  const { map, mapView } = useMapViewState();
  const labelsGraphicsLayerRef = useRef<__esri.GraphicsLayer | null>(null);
  const processedLayersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!map || !mapView) return;

    if (!labelsGraphicsLayerRef.current) {
      const labelsLayer = new GraphicsLayer({
        title: "FeatureLayerLabels",
        visible: true,
      });
      map.add(labelsLayer);
      map.reorder(labelsLayer, map.layers.length - 1);
      labelsGraphicsLayerRef.current = labelsLayer;
    }

    const labelsLayer = labelsGraphicsLayerRef.current;
    if (!labelsLayer) return;

    return attachFeatureLayerLabelSync({
      map,
      labelsLayer,
      processedLayers: processedLayersRef.current,
    });
  }, [map, mapView]);
}
