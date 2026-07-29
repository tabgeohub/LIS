import { FeatureLayerAttributes } from "hooks/zustand/ui/popUpState";
import type { FeatureLayerPopupData } from "./useFeatureLayerPopup";

export function buildFeaturePopupData(input: {
  attributes: FeatureLayerAttributes;
  layerTitle: string;
  screenPoint: { x: number; y: number };
  geometry: __esri.Point;
}): FeatureLayerPopupData {
  return {
    attributes: input.attributes,
    layerTitle: input.layerTitle,
    screenPoint: input.screenPoint,
    geometry: input.geometry,
  };
}

export async function queryFeaturePopupAttributes(input: {
  layer: __esri.FeatureLayer;
  objectId: number | string;
}): Promise<FeatureLayerAttributes | null> {
  try {
    const query = input.layer.createQuery();
    query.objectIds = [input.objectId as number];
    query.returnGeometry = false;
    query.outFields = ["*"];
    const featureSet = await input.layer.queryFeatures(query);
    if (featureSet.features.length > 0) {
      return featureSet.features[0].attributes as FeatureLayerAttributes;
    }
  } catch (error) {
    console.error("Error querying FeatureLayer:", error);
  }
  return null;
}
