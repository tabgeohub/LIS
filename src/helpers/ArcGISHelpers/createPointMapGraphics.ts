import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import MapView from "@arcgis/core/views/MapView";
import {
  POINT_HOVER_PIN_SYMBOL,
  SEARCH_RESULT_POINT_OUTLINE_SYMBOL,
  STARRED_POINT_SYMBOL,
  YELLOW_MARKER_SYMBOL,
} from "@helpers/ArcGISHelpers/createSymbols";
import { EnrichedPointType } from "Types";

export function createPointGeometry(point: EnrichedPointType) {
  return new Point({
    longitude: point.longitude,
    latitude: point.latitude,
    spatialReference: { wkid: 4326 },
  });
}

export function createStarPointGraphic(point: EnrichedPointType) {
  return new Graphic({
    geometry: createPointGeometry(point),
    symbol: STARRED_POINT_SYMBOL,
    attributes: { id: point.id },
  });
}

export function createPointHoverGraphic(point: EnrichedPointType) {
  return new Graphic({
    geometry: createPointGeometry(point),
    symbol: POINT_HOVER_PIN_SYMBOL,
  });
}

export function createSearchResultPointOutlineGraphic(point: EnrichedPointType) {
  return new Graphic({
    geometry: createPointGeometry(point),
    symbol: SEARCH_RESULT_POINT_OUTLINE_SYMBOL,
    attributes: { id: point.id },
  });
}

export function createYellowMarkerGraphic(point: EnrichedPointType) {
  return new Graphic({
    geometry: createPointGeometry(point),
    symbol: YELLOW_MARKER_SYMBOL,
    attributes: point,
  });
}

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

export function mergeStarredPoints(
  starredPoints: EnrichedPointType[],
  pointsToAdd: EnrichedPointType[]
) {
  const combined = [...starredPoints, ...pointsToAdd];
  return Array.from(new Map(combined.map((p) => [p.id, p])).values());
}

export function getUnstarredPoints(
  allPoints: EnrichedPointType[],
  starredPoints: EnrichedPointType[]
) {
  return allPoints.filter(
    (point) => !starredPoints.some((p) => p.id === point.id)
  );
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
