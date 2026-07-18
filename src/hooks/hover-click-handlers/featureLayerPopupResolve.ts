import { FeatureLayerAttributes } from "@helpers/ZustandStates/popUpState";
import { isTargetFeatureLayer } from "./featureLayerTargets";
import type { FeatureLayerPopupData } from "./useFeatureLayerPopup";
import {
  buildFeaturePopupData,
  queryFeaturePopupAttributes,
} from "./featureLayerPopupQuery";

export function findTargetFeatureHit(results: __esri.MapViewViewHit[]) {
  return results.find((result) => {
    if (result.type !== "graphic") return false;
    const graphic = result.graphic;
    if (!graphic?.layer) return false;
    return isTargetFeatureLayer(graphic.layer as __esri.Layer);
  }) as __esri.MapViewGraphicHit | undefined;
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
  const base = {
    attributes: input.attributes,
    layerTitle: input.layer.title ?? "",
    screenPoint: input.screenPoint,
    geometry: input.geometry,
  };
  if (!objectId || !input.layer.title) return buildFeaturePopupData(base);

  const queried = await queryFeaturePopupAttributes({
    layer: input.layer,
    objectId,
  });
  return buildFeaturePopupData({
    ...base,
    attributes: queried ?? input.attributes,
    layerTitle: input.layer.title,
  });
}
