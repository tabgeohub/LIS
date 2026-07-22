import {
  getVisibleTargetFeatureLayers,
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
