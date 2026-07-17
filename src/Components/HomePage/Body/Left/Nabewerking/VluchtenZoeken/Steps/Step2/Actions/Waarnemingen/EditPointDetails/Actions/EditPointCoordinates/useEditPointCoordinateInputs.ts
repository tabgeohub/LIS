import { useEffect, useRef, useState } from "react";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import type { FinishedPointType } from "Types/finished_plans";
import { showRedMarkerAt } from "./pointMapGraphics";
import {
  snapshotPointCoords,
  syncCoordsForCoordinateSystem,
} from "./editPointCoordinateSync";

export type EditPointCoordinateValues = {
  coordinateSystem: string;
  longitude: number;
  latitude: number;
  xcoordinaat_rd: number;
  ycoordinaat_rd: number;
};

export function useEditPointCoordinateInputs(selectedPoint: FinishedPointType | null) {
  const [coordinateSystem, setCoordinateSystem] = useState("WGS84");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [xcoordinaat_rd, setXCoordinaat_rd] = useState(0);
  const [ycoordinaat_rd, setYCoordinaat_rd] = useState(0);

  const originalCoordsRef = useRef<ReturnType<typeof snapshotPointCoords> | null>(
    null
  );

  useEffect(() => {
    if (!selectedPoint) return;
    const next = snapshotPointCoords(selectedPoint);
    setLongitude(next.longitude);
    setLatitude(next.latitude);
    setXCoordinaat_rd(next.xcoordinaat_rd);
    setYCoordinaat_rd(next.ycoordinaat_rd);
    originalCoordsRef.current = next;
  }, [selectedPoint]);

  useEffect(() => {
    if (!selectedPoint) return;
    const patch = syncCoordsForCoordinateSystem({
      coordinateSystem,
      longitude,
      latitude,
      xcoordinaat_rd,
      ycoordinaat_rd,
    });
    if (!patch) return;
    if (patch.longitude != null) setLongitude(patch.longitude);
    if (patch.latitude != null) setLatitude(patch.latitude);
    if (patch.xcoordinaat_rd != null) setXCoordinaat_rd(patch.xcoordinaat_rd);
    if (patch.ycoordinaat_rd != null) setYCoordinaat_rd(patch.ycoordinaat_rd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinateSystem]);

  return {
    coordinateSystem,
    setCoordinateSystem,
    longitude,
    setLongitude,
    latitude,
    setLatitude,
    xcoordinaat_rd,
    setXCoordinaat_rd,
    ycoordinaat_rd,
    setYCoordinaat_rd,
    originalCoordsRef,
  };
}

export function useInitialEditPointMarker(input: {
  selectedPoint: FinishedPointType | null;
  mapView: __esri.MapView | null;
  redGraphicsLayer: __esri.GraphicsLayer | null;
}) {
  useEffect(() => {
    const { selectedPoint, mapView, redGraphicsLayer } = input;
    if (!selectedPoint) return;

    if (
      validateMapView(mapView, redGraphicsLayer) &&
      selectedPoint.longitude &&
      selectedPoint.latitude
    ) {
      showRedMarkerAt({
        redGraphicsLayer: redGraphicsLayer!,
        mapView: mapView!,
        longitude: selectedPoint.longitude,
        latitude: selectedPoint.latitude,
      });
    }
  }, [input.selectedPoint, input.mapView, input.redGraphicsLayer]);
}
