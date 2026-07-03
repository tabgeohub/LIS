import {
  getVisibleTargetFeatureLayers,
  isTargetFeatureLayer,
} from "./featureLayerTargets";
import { queryLayerLabelGraphics } from "./featureLayerLabelGraphics";

export async function refreshFeatureLayerLabels(input: {
  map: __esri.Map;
  labelsLayer: __esri.GraphicsLayer;
  processedLayers: Set<string>;
}) {
  input.labelsLayer.removeAll();
  input.processedLayers.clear();

  for (const layer of getVisibleTargetFeatureLayers(input.map)) {
    if (layer.title && input.processedLayers.has(layer.title)) continue;

    try {
      const graphics = await queryLayerLabelGraphics(layer);
      graphics.forEach((graphic) => input.labelsLayer.add(graphic));
      if (layer.title) input.processedLayers.add(layer.title);
    } catch (error) {
      console.error(`Error querying ${layer.title} for labels:`, error);
    }
  }
}

export function attachFeatureLayerLabelSync(input: {
  map: __esri.Map;
  labelsLayer: __esri.GraphicsLayer;
  processedLayers: Set<string>;
}) {
  const updateLabels = () =>
    refreshFeatureLayerLabels({
      map: input.map,
      labelsLayer: input.labelsLayer,
      processedLayers: input.processedLayers,
    });

  const watchHandle = input.map.layers.on("after-add", (event) => {
    const addedLayer = event.item;
    if (isTargetFeatureLayer(addedLayer)) {
      addedLayer.when(() => setTimeout(updateLabels, 1000));
      return;
    }
    updateLabels();
  });

  const removeHandle = input.map.layers.on("after-remove", updateLabels);

  const visibilityHandles: __esri.Handle[] = [];
  input.map.layers.forEach((layer) => {
    if (!isTargetFeatureLayer(layer)) return;
    visibilityHandles.push(layer.watch("visible", updateLabels));
  });

  updateLabels();

  return () => {
    watchHandle.remove();
    removeHandle.remove();
    visibilityHandles.forEach((handle) => handle.remove());
    input.labelsLayer.removeAll();
  };
}
