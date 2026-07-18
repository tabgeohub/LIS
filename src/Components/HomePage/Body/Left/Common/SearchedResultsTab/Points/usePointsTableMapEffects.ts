import {
  addStarPointGraphics,
  createSearchResultPointOutlineGraphic,
  getUnstarredPoints,
  mergeStarredPoints,
  syncPointsTableMapGraphics,
} from "@helpers/ArcGISHelpers/createPointMapGraphics";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { useEffect, useRef } from "react";
import type { EnrichedPointType } from "Types";

export function usePointsOutlineEffect(
  pointsData: EnrichedPointType[],
  graphicsLayer: __esri.GraphicsLayer | null | undefined
) {
  const hasRunFilter = useRef(false);
  useEffect(() => {
    if (pointsData.length === 0 || hasRunFilter.current) return;
    hasRunFilter.current = true;
    pointsData.forEach((point) => {
      graphicsLayer?.graphics.add(createSearchResultPointOutlineGraphic(point));
    });
  }, []);
}

export function usePointsStarAllEffect(input: {
  pointsData: EnrichedPointType[];
  starredPoints: EnrichedPointType[];
  setStarredPoints: (points: EnrichedPointType[]) => void;
  starredAll: boolean;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  const hasRunStar = useRef(false);
  useEffect(() => {
    if (!input.starredAll || hasRunStar.current || !input.graphicsLayer) return;
    hasRunStar.current = true;
    const newStars = getUnstarredPoints(input.pointsData, input.starredPoints);
    input.setStarredPoints(mergeStarredPoints(input.starredPoints, newStars));
    addStarPointGraphics(newStars, input.graphicsLayer);
  }, [input.starredAll]);
}

export function usePointsSyncGraphicsEffect(input: {
  pointsData: EnrichedPointType[];
  starredPoints: EnrichedPointType[];
  mapView: __esri.MapView | null | undefined;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
  yellowGraphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  useEffect(() => {
    input.graphicsLayer?.removeAll();
    input.yellowGraphicsLayer?.graphics.removeAll();
    if (!validateMapView(input.mapView, input.yellowGraphicsLayer)) return;
    syncPointsTableMapGraphics({
      points: input.pointsData,
      starredPoints: input.starredPoints,
      yellowGraphicsLayer: input.yellowGraphicsLayer!,
      graphicsLayer: input.graphicsLayer,
    });
  }, []);
}
