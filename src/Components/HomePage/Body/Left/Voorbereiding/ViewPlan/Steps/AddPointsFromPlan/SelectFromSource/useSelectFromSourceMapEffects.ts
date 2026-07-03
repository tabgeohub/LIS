import { useEffect, useRef } from "react";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createPointGraphics } from "@helpers/ArcGISHelpers/createPointGraphic";
import type { EnrichedPointType } from "Types";
import {
  filterPointsNotInPlan,
  SelectFromSourceItem,
} from "./helpers/mapSourceItems";
import {
  findHoverableGraphic,
  PinRefMap,
  removeAllPins,
  removeBlueGraphics,
  syncPinsForSelection,
} from "./helpers/selectFromSourceGraphics";

export function useSelectFromSourceMapEffects(input: {
  selectedItem: SelectFromSourceItem | null;
  selectedPointIds: number[];
  planPointIds: Set<number>;
  dbPoints: EnrichedPointType[];
}) {
  const { pointsGraphicsLayer, mapView } = useMapViewState();
  const pinRefs = useRef<PinRefMap>(new Map());
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  useEffect(() => {
    return () => {
      try {
        pointsGraphicsLayer?.removeAll();
      } catch {
        /* ignore */
      }
      blueGraphicsRef.current = removeBlueGraphics(mapView, blueGraphicsRef.current);
      removeAllPins(mapView, pinRefs.current);
      useHoveredGraphicState.getState().setHovered(null);
    };
  }, [mapView, pointsGraphicsLayer]);

  useEffect(() => {
    blueGraphicsRef.current = removeBlueGraphics(mapView, blueGraphicsRef.current);
    pointsGraphicsLayer?.removeAll();
    removeAllPins(mapView, pinRefs.current);
  }, [input.selectedItem, mapView, pointsGraphicsLayer]);

  useEffect(() => {
    blueGraphicsRef.current = removeBlueGraphics(mapView, blueGraphicsRef.current);
    pointsGraphicsLayer?.removeAll();
    if (!input.selectedItem) return;

    const uncommonPoints = filterPointsNotInPlan(
      input.selectedItem.points,
      input.planPointIds
    );
    const graphics = createPointGraphics(uncommonPoints, {
      symbolOptions: {
        color: "blue",
        size: 10,
        style: "circle",
        outlineColor: "white",
        outlineWidth: 1,
      },
      transformCoordinates: true,
    });

    if (!graphics.length) return;

    if (pointsGraphicsLayer) {
      pointsGraphicsLayer.addMany(graphics as __esri.Graphic[]);
      return;
    }

    if (mapView) {
      mapView.graphics.addMany(graphics as __esri.Graphic[]);
      blueGraphicsRef.current = graphics;
    }
  }, [input.selectedItem, input.planPointIds, pointsGraphicsLayer, mapView]);

  useEffect(() => {
    if (!mapView || !input.selectedItem) return;
    syncPinsForSelection({
      mapView,
      selectedPointIds: input.selectedPointIds,
      itemPoints: input.selectedItem.points,
      dbPoints: input.dbPoints,
      pinRefs: pinRefs.current,
    });
  }, [input.selectedPointIds, input.selectedItem, mapView, input.dbPoints]);

  useEffect(() => {
    if (!mapView || !input.selectedItem) return;

    const handle = mapView.on("pointer-move", async (event) => {
      const hit = await mapView.hitTest(event);
      const graphic = findHoverableGraphic({
        hitResults: hit.results,
        pinRefs: pinRefs.current,
        pointsGraphicsLayer,
      });

      const { setHovered } = useHoveredGraphicState.getState();
      if (!graphic) {
        setHovered(null);
        return;
      }

      setHovered({
        id: graphic.attributes.id,
        label: graphic.attributes.label || graphic.attributes.omschrijving || "",
      });
    });

    return () => {
      handle.remove();
      useHoveredGraphicState.getState().setHovered(null);
    };
  }, [mapView, input.selectedItem, pointsGraphicsLayer]);
}
