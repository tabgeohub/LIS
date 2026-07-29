export const TARGET_FEATURE_LAYER_TITLES = ["Strandpalen", "Damnummers"] as const;

export function isTargetFeatureLayer(layer: __esri.Layer | null | undefined): layer is __esri.FeatureLayer {
  return (
    !!layer &&
    layer.type === "feature" &&
    !!layer.title &&
    TARGET_FEATURE_LAYER_TITLES.includes(
      layer.title as (typeof TARGET_FEATURE_LAYER_TITLES)[number]
    )
  );
}

export function getVisibleTargetFeatureLayers(map: __esri.Map) {
  return map.layers
    .toArray()
    .filter(
      (layer): layer is __esri.FeatureLayer =>
        isTargetFeatureLayer(layer) && layer.visible === true
    );
}
