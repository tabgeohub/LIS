import {
  buildFeatureLabelGraphic,
  queryLayerFeatures,
} from "./featureLayerLabelGraphicsHelpers";

export async function queryLayerLabelGraphics(
  layer: __esri.FeatureLayer
): Promise<__esri.Graphic[]> {
  const featureSet = await queryLayerFeatures(layer);
  const graphics: __esri.Graphic[] = [];

  for (const feature of featureSet.features) {
    const geometry = feature.geometry as __esri.Point;
    if (!geometry || !layer.title) continue;
    const graphic = buildFeatureLabelGraphic({
      geometry,
      layerTitle: layer.title,
      attributes: feature.attributes as Record<string, unknown>,
    });
    if (graphic) graphics.push(graphic);
  }

  return graphics;
}
