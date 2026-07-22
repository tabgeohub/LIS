import { FeatureLayerAttributes } from "@helpers/ZustandStates/popUpState";

const OBJECT_ID_KEYS = [
  "OBJECTID",
  "objectId",
  "objectid",
  "FID",
  "fid",
] as const;

export function readFeatureObjectId(attributes: FeatureLayerAttributes) {
  for (const key of OBJECT_ID_KEYS) {
    const value = attributes?.[key];
    if (value != null && value !== "") return value;
  }
  return undefined;
}
