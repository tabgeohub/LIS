import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
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
