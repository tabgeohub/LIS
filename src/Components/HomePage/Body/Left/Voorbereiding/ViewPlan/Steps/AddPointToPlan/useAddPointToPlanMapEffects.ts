/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { EnrichedPointType } from "Types";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import { createPointGraphics } from "@helpers/ArcGISHelpers/createPointGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { useHoverPointsAndGeometries } from "hooks/features/useHoverPointsAndGeometries";

export function useAddPointToPlanBluePoints(filteredPoints: EnrichedPointType[]) {
  const { mapView, pointsGraphicsLayer } = useMapViewState();
  const blueGraphicsRef = useRef<__esri.Graphic[]>([]);

  useEffect(() => {
    if (mapView && blueGraphicsRef.current.length) {
      try {
        mapView.graphics.removeMany(blueGraphicsRef.current);
      } catch {}
      blueGraphicsRef.current = [];
    }
    pointsGraphicsLayer?.removeAll();

    if (!filteredPoints.length) return;

    const graphics = createPointGraphics(filteredPoints, {
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
    } else if (mapView) {
      mapView.graphics.addMany(graphics as __esri.Graphic[]);
      blueGraphicsRef.current = graphics;
    }
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
