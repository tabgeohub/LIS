import Graphic from "@arcgis/core/Graphic";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import { getFeatureLayerLabelText } from "./featureLayerLabelText";

export async function queryLayerLabelGraphics(
  layer: __esri.FeatureLayer
): Promise<__esri.Graphic[]> {
  if (!layer.loaded) await layer.load();
  await new Promise((resolve) => setTimeout(resolve, 500));

  const query = layer.createQuery();
  query.where = "1=1";
  query.outFields = ["*"];
  query.returnGeometry = true;

  const featureSet = await layer.queryFeatures(query);
  const graphics: __esri.Graphic[] = [];

  for (const feature of featureSet.features) {
    const geometry = feature.geometry as __esri.Point;
    if (!geometry || !layer.title) continue;

    const labelText = getFeatureLayerLabelText(
      layer.title,
      feature.attributes as Record<string, unknown>
    );
    if (!labelText) continue;

    graphics.push(
      new Graphic({
        geometry,
        symbol: new TextSymbol({
          text: labelText,
          color: [0, 0, 0, 1],
          font: { size: 8, family: "Arial", weight: "bold" },
          haloColor: [255, 255, 255, 1],
          haloSize: 1,
          yoffset: 6,
        }),
        attributes: { type: "feature-layer-label", layerTitle: layer.title },
      })
    );
  }

  return graphics;
}
