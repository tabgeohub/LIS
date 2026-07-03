import { FeatureLayerAttributes } from "@helpers/ZustandStates/popUpState";
import { isTargetFeatureLayer } from "./featureLayerTargets";
import type { FeatureLayerPopupData } from "./useFeatureLayerPopup";

export function findTargetFeatureHit(results: __esri.HitTestResult[]) {
  return results.find((result) => {
    const graphic = (result as __esri.GraphicHit).graphic;
    if (!graphic?.layer) return false;
    return isTargetFeatureLayer(graphic.layer as __esri.Layer);
  }) as __esri.GraphicHit | undefined;
}

export function readFeatureObjectId(attributes: FeatureLayerAttributes) {
  return (
    attributes?.OBJECTID ||
    attributes?.objectId ||
    attributes?.objectid ||
    attributes?.FID ||
    attributes?.fid
  );
}

export async function resolveFeaturePopupData(input: {
  layer: __esri.FeatureLayer;
  attributes: FeatureLayerAttributes;
  geometry: __esri.Point;
  screenPoint: { x: number; y: number };
}): Promise<FeatureLayerPopupData> {
  const objectId = readFeatureObjectId(input.attributes);
  if (!objectId || !input.layer.title) {
    return {
      attributes: input.attributes,
      layerTitle: input.layer.title ?? "",
      screenPoint: input.screenPoint,
      geometry: input.geometry,
    };
  }

  try {
    const query = input.layer.createQuery();
    query.objectIds = [objectId];
    query.returnGeometry = false;
    query.outFields = ["*"];

    const featureSet = await input.layer.queryFeatures(query);
    if (featureSet.features.length > 0) {
      return {
        attributes: featureSet.features[0].attributes as FeatureLayerAttributes,
        layerTitle: input.layer.title,
        screenPoint: input.screenPoint,
        geometry: input.geometry,
      };
    }
  } catch (error) {
    console.error("Error querying FeatureLayer:", error);
  }

  return {
    attributes: input.attributes,
    layerTitle: input.layer.title,
    screenPoint: input.screenPoint,
    geometry: input.geometry,
  };
}
