import MapView from "@arcgis/core/views/MapView";
import { EnrichedPointType } from "Types";
import {
  getUnstarredPoints,
  mergeStarredPoints,
} from "@helpers/points/starredPointSelection";
import {
  createPointGeometry,
  createStarPointGraphic,
  createYellowMarkerGraphic,
} from "./pointMapGraphicFactories";

export function addStarPointGraphic(
  point: EnrichedPointType,
  layer: __esri.GraphicsLayer
) {
  layer.graphics.add(createStarPointGraphic(point));
}

export function removeStarPointGraphics(
  pointId: number | string,
  layer: __esri.GraphicsLayer
) {
  layer.graphics.removeMany(
    layer.graphics.filter((graphic) => graphic.attributes?.id === pointId)
  );
}

export function addStarPointGraphics(
  points: EnrichedPointType[],
  layer: __esri.GraphicsLayer
) {
  points.forEach((point) => addStarPointGraphic(point, layer));
}

export function goToEnrichedPoint(
  mapView: MapView | null | undefined,
  point: EnrichedPointType
) {
  if (!mapView) return;
  mapView.goTo(createPointGeometry(point));
}

export function starAllPointsOnMap({
  points,
  starredPoints,
  setStarredPoints,
  graphicsLayer,
}: {
  points: EnrichedPointType[];
  starredPoints: EnrichedPointType[];
  setStarredPoints: (value: EnrichedPointType[]) => void;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  if (!graphicsLayer) return;

  const newStars = getUnstarredPoints(points, starredPoints);
  setStarredPoints(mergeStarredPoints(starredPoints, newStars));
  addStarPointGraphics(newStars, graphicsLayer);
}

export function syncPointsTableMapGraphics({
  points,
  starredPoints,
  yellowGraphicsLayer,
  graphicsLayer,
}: {
  points: EnrichedPointType[];
  starredPoints: EnrichedPointType[];
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  points.forEach((point) => {
    if (!point) return;

    yellowGraphicsLayer?.add(createYellowMarkerGraphic(point));

    const alreadyStarred = starredPoints.find((p) => p.id === point.id);
    if (alreadyStarred && graphicsLayer) {
      addStarPointGraphic(point, graphicsLayer);
    }
  });
}
