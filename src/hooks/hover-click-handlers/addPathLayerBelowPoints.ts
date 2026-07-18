import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { reorderPointsAbovePath } from "./reorderPointsAbovePath";

function addPathLayerAtPointsIndex(
  map: __esri.Map,
  pathLayer: FeatureLayer,
  pointsGraphicsLayer: __esri.GraphicsLayer
) {
  const pointsLayerIndex = map.layers.indexOf(pointsGraphicsLayer);
  if (pointsLayerIndex >= 0) {
    map.add(pathLayer, pointsLayerIndex);
  } else {
    map.add(pathLayer);
  }
}

export function addPathLayerBelowPoints(input: {
  mapView: __esri.MapView;
  pathLayer: FeatureLayer;
  pointsGraphicsLayer?: __esri.GraphicsLayer | null;
}) {
  const { mapView, pathLayer, pointsGraphicsLayer } = input;
  const map = mapView.map;
  if (!map) return;
  if (pointsGraphicsLayer) {
    addPathLayerAtPointsIndex(map, pathLayer, pointsGraphicsLayer);
  } else {
    map.add(pathLayer);
  }
  reorderPointsAbovePath(map, pathLayer, pointsGraphicsLayer);
}
