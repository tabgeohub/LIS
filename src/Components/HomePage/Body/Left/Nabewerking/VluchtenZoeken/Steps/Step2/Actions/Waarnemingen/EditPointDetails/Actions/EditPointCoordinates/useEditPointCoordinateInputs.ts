import { useEffect, useRef, useState } from "react";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import type { FinishedPointType } from "Types/finished_plans";
import { showRedMarkerAt } from "./pointMapGraphics";

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

  const originalCoordsRef = useRef<{
    longitude: number;
    latitude: number;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
  } | null>(null);

  useEffect(() => {
    if (!selectedPoint) return;

    const next = {
      longitude: selectedPoint.longitude || 0,
      latitude: selectedPoint.latitude || 0,
      xcoordinaat_rd: selectedPoint.xcoordinaat_rd || 0,
      ycoordinaat_rd: selectedPoint.ycoordinaat_rd || 0,
    };

    setLongitude(next.longitude);
    setLatitude(next.latitude);
    setXCoordinaat_rd(next.xcoordinaat_rd);
    setYCoordinaat_rd(next.ycoordinaat_rd);
    originalCoordsRef.current = next;
  }, [selectedPoint]);

  useEffect(() => {
    if (!selectedPoint) return;

    if (coordinateSystem === "RD" && xcoordinaat_rd && ycoordinaat_rd) {
      const transformed = getTransformedCoordinates({
        fromProjection: "RD",
        toProjection: "WGS84",
        x: xcoordinaat_rd,
        y: ycoordinaat_rd,
      });
      setLongitude(transformed.x);
      setLatitude(transformed.y);
      return;
    }

    if (coordinateSystem === "WGS84" && longitude && latitude) {
      const transformed = getTransformedCoordinates({
        fromProjection: "WGS84",
        toProjection: "RD",
        x: longitude,
        y: latitude,
      });
      setXCoordinaat_rd(transformed.x);
      setYCoordinaat_rd(transformed.y);
    }
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
      showRedMarkerAt(
        redGraphicsLayer!,
        mapView!,
        selectedPoint.longitude,
        selectedPoint.latitude
      );
    }
  }, [input.selectedPoint, input.mapView, input.redGraphicsLayer]);
}
