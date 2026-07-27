import {
  getVisibleTargetFeatureLayers,
} from "./featureLayerTargets";
import { queryLayerLabelGraphics } from "./featureLayerLabelGraphics";

function shouldSkipLayer(
  layer: __esri.Layer,
  processedLayers: Set<string>
): boolean {
  return Boolean(layer.title && processedLayers.has(layer.title));
}

function markLayerProcessed(
  layer: __esri.Layer,
  processedLayers: Set<string>
): void {
  if (layer.title) processedLayers.add(layer.title);
}

async function addLayerLabelGraphics(input: {
  layer: __esri.FeatureLayer;
  labelsLayer: __esri.GraphicsLayer;
}): Promise<void> {
  try {
    const graphics = await queryLayerLabelGraphics(input.layer);
    graphics.forEach((graphic) => input.labelsLayer.add(graphic));
  } catch (error) {
    console.error(`Error querying ${input.layer.title} for labels:`, error);
  }
}

export async function refreshFeatureLayerLabels(input: {
  map: __esri.Map;
  labelsLayer: __esri.GraphicsLayer;
  processedLayers: Set<string>;
}) {
  input.labelsLayer.removeAll();
  input.processedLayers.clear();

  for (const layer of getVisibleTargetFeatureLayers(input.map)) {
    if (shouldSkipLayer(layer, input.processedLayers)) continue;
    await addLayerLabelGraphics({
      layer,
      labelsLayer: input.labelsLayer,
    });
    markLayerProcessed(layer, input.processedLayers);
  }
}
