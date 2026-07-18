import Graphic from "@arcgis/core/Graphic";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import { getFeatureLayerLabelText } from "./featureLayerLabelText";

export function buildFeatureLabelGraphic(input: {
  geometry: __esri.Point;
  layerTitle: string;
  attributes: Record<string, unknown>;
}): __esri.Graphic | null {
  const labelText = getFeatureLayerLabelText(input.layerTitle, input.attributes);
  if (!labelText) return null;

  return new Graphic({
    geometry: input.geometry,
    symbol: new TextSymbol({
      text: labelText,
      color: [0, 0, 0, 1],
      font: { size: 8, family: "Arial", weight: "bold" },
      haloColor: [255, 255, 255, 1],
      haloSize: 1,
      yoffset: 6,
    }),
    attributes: { type: "feature-layer-label", layerTitle: input.layerTitle },
  });
}

export async function queryLayerFeatures(
  layer: __esri.FeatureLayer
): Promise<__esri.FeatureSet> {
  if (!layer.loaded) await layer.load();
  await new Promise((resolve) => setTimeout(resolve, 500));
  const query = layer.createQuery();
  query.where = "1=1";
  query.outFields = ["*"];
  query.returnGeometry = true;
  return layer.queryFeatures(query);
}
