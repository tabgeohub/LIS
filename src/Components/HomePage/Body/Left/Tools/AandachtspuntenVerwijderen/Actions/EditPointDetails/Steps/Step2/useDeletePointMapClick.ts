/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import createPoint from "@helpers/ArcGISHelpers/createPoint";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  addRedPointGraphic,
  applyWgs84MapClickCoords,
  isValidMapClickPoint,
} from "Components/HomePage/Body/Common/EditPoint/editPointMapClickCoords";

type CoordSetter = (coords: {
  rdX: number;
  rdY: number;
  latitude: number;
  longitude: number;
}) => void;

export function useDeletePointMapClick(input: {
  subStep: number;
  currentPoint: { x: number; y: number };
  setCurrentPoint: (value: { x: number; y: number }) => void;
  setCoords: CoordSetter;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (input.subStep !== 1 || !mapView || !redGraphicsLayer) return;

    const handle = mapView.on("click", async (event) => {
      if (!isValidMapClickPoint(event.mapPoint)) return;

      const hit = await mapView.hitTest(event);
      const hasFeature = hit.results.some(
        (result) => (result as __esri.GraphicHit).graphic
      );
      if (hasFeature) return;

      const { longitude, latitude } = event.mapPoint!;
      const transformed = applyWgs84MapClickCoords({ longitude, latitude });

      input.setCurrentPoint({ x: longitude, y: latitude });
      input.setCoords({
        rdX: transformed.x,
        rdY: transformed.y,
        latitude,
        longitude,
      });

      if (input.currentPoint.x !== 0 && input.currentPoint.y !== 0) {
        const stale = mapView.graphics
          .toArray()
          .find(
            (graphic) =>
              graphic.geometry?.type === "point" &&
              graphic.geometry.x === input.currentPoint.x &&
              graphic.geometry.y === input.currentPoint.y
          );
        if (stale) mapView.graphics.remove(stale);
      }

      redGraphicsLayer.removeAll();
      redGraphicsLayer.add(createPoint(longitude, latitude));
    });

    return () => handle.remove();
  }, [mapView, redGraphicsLayer, input.subStep, input.currentPoint.x, input.currentPoint.y]);
}
