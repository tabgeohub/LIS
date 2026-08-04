import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export function reorderPointsAbovePath(input: {
  map: __esri.Map;
  pathLayer: FeatureLayer;
  pointsGraphicsLayer?: __esri.GraphicsLayer | null;
}) {
  const { map, pathLayer, pointsGraphicsLayer } = input;
  if (
    !pointsGraphicsLayer ||
    !map.layers.includes(pointsGraphicsLayer) ||
    !map.layers.includes(pathLayer)
  ) {
    return;
  }
  const pathIndex = map.layers.indexOf(pathLayer);
  const pointsIndex = map.layers.indexOf(pointsGraphicsLayer);
  if (pointsIndex < pathIndex) {
    map.reorder(pointsGraphicsLayer, pathIndex + 1);
  }
}
