import { useEffect, useRef } from "react";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import type { EnrichedPointType } from "Types";
import {
  removeOwnedBluePointGraphics,
  syncBluePointGraphics,
} from "hooks/map/syncBluePointGraphics";
import { filterPointsNotInPlan, SelectFromSourceItem } from "./helpers/mapSourceItems";
import {
  findHoverableGraphic,
  PinRefMap,
  removeAllPins,
  syncPinsForSelection,
} from "./helpers/selectFromSourceGraphics";

export function useSelectFromSourceGraphicsLifecycle(input: {
  selectedItem: SelectFromSourceItem | null;
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
}) {
  const pinRefs = useRef<PinRefMap>(new Map());
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  useEffect(() => () => {
    try {
      input.pointsGraphicsLayer?.removeAll();
    } catch {
      // The ArcGIS layer may already have been destroyed during navigation.
    }
    blueGraphicsRef.current = removeOwnedBluePointGraphics(
      input.mapView,
      blueGraphicsRef.current
    );
    removeAllPins(input.mapView, pinRefs.current);
    useHoveredGraphicState.getState().setHovered(null);
  }, [input.mapView, input.pointsGraphicsLayer]);

  useEffect(() => {
    blueGraphicsRef.current = removeOwnedBluePointGraphics(
      input.mapView,
      blueGraphicsRef.current
    );
    input.pointsGraphicsLayer?.removeAll();
    removeAllPins(input.mapView, pinRefs.current);
  }, [input.selectedItem, input.mapView, input.pointsGraphicsLayer]);

  return { pinRefs, blueGraphicsRef };
}

export function useBluePointRendering(input: {
  selectedItem: SelectFromSourceItem | null;
  planPointIds: Set<number>;
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  blueGraphicsRef: React.MutableRefObject<__esri.Graphic[]>;
}) {
  useEffect(() => {
    const points = input.selectedItem
      ? filterPointsNotInPlan(input.selectedItem.points, input.planPointIds)
      : [];
    input.blueGraphicsRef.current = syncBluePointGraphics({
      points,
      mapView: input.mapView,
      pointsGraphicsLayer: input.pointsGraphicsLayer,
      ownedGraphics: input.blueGraphicsRef.current,
    });
  }, [
    input.selectedItem,
    input.planPointIds,
    input.mapView,
    input.pointsGraphicsLayer,
    input.blueGraphicsRef,
  ]);
}

export function useSelectionPins(input: {
  selectedItem: SelectFromSourceItem | null;
  selectedPointIds: number[];
  dbPoints: EnrichedPointType[];
  mapView: __esri.MapView | null;
  pinRefs: React.MutableRefObject<PinRefMap>;
}) {
  useEffect(() => {
    if (!input.mapView || !input.selectedItem) return;
    syncPinsForSelection({
      mapView: input.mapView,
      selectedPointIds: input.selectedPointIds,
      itemPoints: input.selectedItem.points,
      dbPoints: input.dbPoints,
      pinRefs: input.pinRefs.current,
    });
  }, [
    input.mapView,
    input.selectedItem,
    input.selectedPointIds,
    input.dbPoints,
    input.pinRefs,
  ]);
}

export function useSourcePointHover(input: {
  selectedItem: SelectFromSourceItem | null;
  mapView: __esri.MapView | null;
  pointsGraphicsLayer: __esri.GraphicsLayer | null;
  pinRefs: React.MutableRefObject<PinRefMap>;
}) {
  useEffect(() => {
    if (!input.mapView || !input.selectedItem) return;
    const handle = input.mapView.on("pointer-move", async (event) => {
      const hit = await input.mapView!.hitTest(event);
      const graphic = findHoverableGraphic({
        hitResults: hit.results,
        pinRefs: input.pinRefs.current,
        pointsGraphicsLayer: input.pointsGraphicsLayer,
      });
      useHoveredGraphicState.getState().setHovered(
        graphic
          ? {
              id: graphic.attributes.id,
              label: graphic.attributes.label || graphic.attributes.omschrijving || "",
            }
          : null
      );
    });
    return () => {
      handle.remove();
      useHoveredGraphicState.getState().setHovered(null);
    };
  }, [input.mapView, input.selectedItem, input.pointsGraphicsLayer, input.pinRefs]);
}
