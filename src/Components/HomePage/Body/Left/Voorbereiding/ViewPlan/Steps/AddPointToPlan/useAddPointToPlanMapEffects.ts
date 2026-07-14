/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { EnrichedPointType } from "Types";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { useHoverPointsAndGeometries } from "hooks/features/useHoverPointsAndGeometries";
import { syncBluePointGraphics } from "hooks/map/syncBluePointGraphics";

export function useAddPointToPlanBluePoints(filteredPoints: EnrichedPointType[]) {
  const { mapView, pointsGraphicsLayer } = useMapViewState();
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  useEffect(() => {
    blueGraphicsRef.current = syncBluePointGraphics({
      points: filteredPoints,
      mapView,
      pointsGraphicsLayer,
      ownedGraphics: blueGraphicsRef.current,
    });
  }, [filteredPoints, mapView, pointsGraphicsLayer]);
}

export function useAddPointToPlanPins(
  selectedPointIds: number[],
  dbPoints: EnrichedPointType[]
) {
  const { mapView } = useMapViewState();
  const pinRefs = useRef<
    Map<number, { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }>
  >(new Map());

  useEffect(() => {
    if (!validateMapView(mapView)) return;

    const currentIds = new Set(selectedPointIds);

    pinRefs.current.forEach((value, key) => {
      if (!currentIds.has(key)) {
        mapView?.graphics.removeMany([value.outerGraphic, value.pinGraphic]);
        pinRefs.current.delete(key);
      }
    });

    dbPoints.forEach((pt) => {
      if (!currentIds.has(pt.id) || pinRefs.current.has(pt.id)) return;
      const res = createPin({
        point: pt as EnrichedPointType,
        mapView: mapView as __esri.MapView,
        label: pt.omschrijving,
      });
      pinRefs.current.set(pt.id, res);
    });
  }, [selectedPointIds, mapView, dbPoints]);

  useHoverPointsAndGeometries({ pinRefs });

  useEffect(() => {
    return () => {
      if (!mapView) return;
      const snapshot = new Map(pinRefs.current);
      snapshot.forEach(({ outerGraphic, pinGraphic }) => {
        mapView.graphics.removeMany([outerGraphic, pinGraphic]);
      });
      pinRefs.current.clear();
    };
  }, [mapView]);

  return pinRefs;
}
