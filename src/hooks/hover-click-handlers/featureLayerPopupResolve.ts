import { isTargetFeatureLayer } from "./featureLayerTargets";
import type { FeatureLayerPopupData } from "./useFeatureLayerPopup";
import {
  buildFeaturePopupData,
  queryFeaturePopupAttributes,
} from "./featureLayerPopupQuery";
import { readFeatureObjectId } from "./featureLayerObjectId";

export { readFeatureObjectId } from "./featureLayerObjectId";

function isGraphicWithLayer(
  result: __esri.MapViewViewHit
): result is __esri.MapViewGraphicHit {
  return result.type === "graphic" && Boolean(result.graphic?.layer);
}

export function findTargetFeatureHit(results: __esri.MapViewViewHit[]) {
  return results.find((result) => {
    if (!isGraphicWithLayer(result)) return false;
    return isTargetFeatureLayer(result.graphic.layer as __esri.Layer);
  }) as __esri.MapViewGraphicHit | undefined;
}

type PopupResolveBase = {
  attributes: import("@helpers/ZustandStates/popUpState").FeatureLayerAttributes;
  layerTitle: string;
  screenPoint: { x: number; y: number };
  geometry: __esri.Point;
};

function buildPopupBase(input: {
  layer: __esri.FeatureLayer;
  attributes: PopupResolveBase["attributes"];
  geometry: __esri.Point;
  screenPoint: { x: number; y: number };
}): PopupResolveBase {
  return {
    attributes: input.attributes,
    layerTitle: input.layer.title ?? "",
    screenPoint: input.screenPoint,
    geometry: input.geometry,
  };
}

async function resolveQueriedPopupAttributes(input: {
  layer: __esri.FeatureLayer;
  objectId: unknown;
  layerTitle: string;
  base: PopupResolveBase;
}): Promise<FeatureLayerPopupData> {
  const queried = await queryFeaturePopupAttributes({
    layer: input.layer,
    objectId: input.objectId,
  });
  return buildFeaturePopupData({
    ...input.base,
    attributes: queried ?? input.base.attributes,
    layerTitle: input.layerTitle,
  });
}

export async function resolveFeaturePopupData(input: {
  layer: __esri.FeatureLayer;
  attributes: PopupResolveBase["attributes"];
  geometry: __esri.Point;
  screenPoint: { x: number; y: number };
}): Promise<FeatureLayerPopupData> {
  const base = buildPopupBase(input);
  const objectId = readFeatureObjectId(input.attributes);
  const layerTitle = input.layer.title ?? undefined;

  if (!objectId || !layerTitle) {
    return buildFeaturePopupData(base);
  }

  return resolveQueriedPopupAttributes({
    layer: input.layer,
    objectId,
    layerTitle,
    base,
  });
}
