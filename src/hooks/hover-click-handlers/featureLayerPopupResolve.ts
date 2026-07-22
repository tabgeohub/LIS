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

function canQueryFeatureAttributes(
  objectId: unknown,
  layerTitle: string | undefined
): boolean {
  return Boolean(objectId && layerTitle);
}

export async function resolveFeaturePopupData(input: {
  layer: __esri.FeatureLayer;
  attributes: import("@helpers/ZustandStates/popUpState").FeatureLayerAttributes;
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

  const layerTitle = input.layer.title ?? undefined;
  if (!canQueryFeatureAttributes(objectId, layerTitle)) {
    return buildFeaturePopupData(base);
  }

  const queried = await queryFeaturePopupAttributes({
    layer: input.layer,
    objectId,
  });
  return buildFeaturePopupData({
    ...base,
    attributes: queried ?? input.attributes,
    layerTitle: layerTitle!,
  });
}
