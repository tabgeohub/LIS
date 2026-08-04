import { isTargetFeatureLayer } from "./featureLayerTargets";
import { refreshFeatureLayerLabels } from "./refreshFeatureLayerLabels";

export { refreshFeatureLayerLabels } from "./refreshFeatureLayerLabels";

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
