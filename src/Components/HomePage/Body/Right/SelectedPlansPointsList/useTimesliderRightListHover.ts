import { useCallback, useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { FinishedGeometryType, FinishedPointType } from "Types/finished_plans";
import {
  clearRightListHover,
  drawGeometryHoverSkyBlue,
  drawHoverPin,
} from "@helpers/timeslider";

export function useTimesliderRightListHover() {
  const { graphicsLayerHover } = useMapViewState();

  useEffect(() => {
    return () => {
      if (graphicsLayerHover) clearRightListHover(graphicsLayerHover);
    };
  }, [graphicsLayerHover]);

  const onPointEnter = useCallback(
    (point: FinishedPointType) => {
      if (!graphicsLayerHover) return;
      clearRightListHover(graphicsLayerHover);
      const coords = getPointCoordinates(point, true);
      if (!coords) return;
      drawHoverPin(
        graphicsLayerHover,
        coords.longitude,
        coords.latitude,
        point.id
      );
    },
    [graphicsLayerHover]
  );

  const onGeometryEnter = useCallback(
    (geometry: FinishedGeometryType) => {
      if (!graphicsLayerHover) return;
      clearRightListHover(graphicsLayerHover);
      drawGeometryHoverSkyBlue(graphicsLayerHover, geometry);
    },
    [graphicsLayerHover]
  );

  const onLeave = useCallback(() => {
    if (!graphicsLayerHover) return;
    clearRightListHover(graphicsLayerHover);
  }, [graphicsLayerHover]);

  return { onPointEnter, onGeometryEnter, onLeave };
}
