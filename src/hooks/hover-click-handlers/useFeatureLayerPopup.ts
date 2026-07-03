import { useEffect, useRef, useCallback, useState } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { attachFeatureLayerPopupClick } from "./featureLayerPopupClick";
import {
  clearFeatureLayerMarker,
  createFeatureLayerMarker,
} from "./featureLayerPopupMarker";

export type FeatureLayerPopupData = {
  attributes: import("@helpers/ZustandStates/popUpState").FeatureLayerAttributes;
  layerTitle: string;
  screenPoint: { x: number; y: number };
  geometry: __esri.Point | null;
} | null;

export default function useFeatureLayerPopup() {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const [popupData, setPopupData] = useState<FeatureLayerPopupData>(null);
  const markerGraphicRef = useRef<__esri.Graphic | null>(null);

  const clearMarker = useCallback(() => {
    clearFeatureLayerMarker({
      redGraphicsLayer,
      marker: markerGraphicRef.current,
    });
    markerGraphicRef.current = null;
  }, [redGraphicsLayer]);

  const createMarker = useCallback(
    (geometry: __esri.Point) => {
      if (!redGraphicsLayer) return;
      markerGraphicRef.current = createFeatureLayerMarker({
        redGraphicsLayer,
        geometry,
        existingMarker: markerGraphicRef.current,
      });
    },
    [redGraphicsLayer]
  );

  useEffect(() => {
    if (!mapView) return;
    return attachFeatureLayerPopupClick({
      mapView,
      clearMarker,
      createMarker,
      setPopupData,
    });
  }, [mapView, createMarker, clearMarker]);

  const closePopup = useCallback(() => {
    clearMarker();
    setPopupData(null);
  }, [clearMarker]);

  useEffect(() => () => clearMarker(), [clearMarker]);

  return { popupData, closePopup };
}
