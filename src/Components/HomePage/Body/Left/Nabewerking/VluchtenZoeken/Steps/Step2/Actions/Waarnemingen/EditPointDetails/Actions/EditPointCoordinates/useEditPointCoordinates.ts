import { useEffect, useRef, useState } from "react";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { useUpdateData } from "utils/useUpdateData";
import useLogAction from "hooks/useLogAction";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";
import {
  coordsFromMapClick,
  finalizeCoordinateValues,
} from "./coordinateFinalize";
import {
  restoreOriginalPointGraphic,
  showRedMarkerAt,
  updatePreviewGraphics,
  updateSavedGraphics,
} from "./pointMapGraphics";

export function useEditPointCoordinates(setAction: (value: string) => void) {
  const logAction = useLogAction();
  const { selectedPoint, selectedPlan, setSelectedPlan, setSelectedPoint } =
    useFinishedPlansState();
  const {
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    yellowGraphicsLayer,
  } = useMapViewState();
  const { update, loading } = useUpdateData(`/points/${selectedPoint?.id}`);

  const [coordinateSystem, setCoordinateSystem] = useState("WGS84");
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [xcoordinaat_rd, setXCoordinaat_rd] = useState(0);
  const [ycoordinaat_rd, setYCoordinaat_rd] = useState(0);

  const clickHandleRef = useRef<__esri.Handle | null>(null);
  const originalCoordsRef = useRef<{
    longitude: number;
    latitude: number;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
  } | null>(null);

  useEffect(() => {
    if (!selectedPoint) return;

    setLongitude(selectedPoint.longitude || 0);
    setLatitude(selectedPoint.latitude || 0);
    setXCoordinaat_rd(selectedPoint.xcoordinaat_rd || 0);
    setYCoordinaat_rd(selectedPoint.ycoordinaat_rd || 0);

    originalCoordsRef.current = {
      longitude: selectedPoint.longitude || 0,
      latitude: selectedPoint.latitude || 0,
      xcoordinaat_rd: selectedPoint.xcoordinaat_rd || 0,
      ycoordinaat_rd: selectedPoint.ycoordinaat_rd || 0,
    };

    if (
      validateMapView(mapView, redGraphicsLayer) &&
      selectedPoint.longitude &&
      selectedPoint.latitude
    ) {
      showRedMarkerAt(
        redGraphicsLayer,
        mapView,
        selectedPoint.longitude,
        selectedPoint.latitude
      );
    }
  }, [selectedPoint, mapView, redGraphicsLayer]);

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

  useEffect(() => {
    if (!mapView || !redGraphicsLayer) return;

    const clickHandle = mapView.on("click", (event) => {
      event.stopPropagation?.();
      if (!event.mapPoint?.longitude || !event.mapPoint?.latitude) return;

      const next = coordsFromMapClick(
        coordinateSystem,
        event.mapPoint.longitude,
        event.mapPoint.latitude
      );
      setLongitude(next.longitude);
      setLatitude(next.latitude);
      setXCoordinaat_rd(next.xcoordinaat_rd);
      setYCoordinaat_rd(next.ycoordinaat_rd);
      showRedMarkerAt(
        redGraphicsLayer,
        mapView,
        next.longitude,
        next.latitude
      );

      logAction({
        message: "User clicked on map to update point coordinates",
        step: "Second step - Edit point coordinates",
        newData: { longitude: next.longitude, latitude: next.latitude },
      });
    });

    clickHandleRef.current = clickHandle;
    return () => clickHandle.remove();
  }, [mapView, redGraphicsLayer, coordinateSystem, logAction]);

  useEffect(() => {
    if (!mapView || !redGraphicsLayer || !pointsGraphicsLayer || !selectedPoint) {
      return;
    }
    if (!longitude || !latitude) return;

    const timeoutId = setTimeout(() => {
      updatePreviewGraphics({
        mapView,
        redGraphicsLayer,
        pointsGraphicsLayer,
        point: selectedPoint,
        longitude,
        latitude,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    longitude,
    latitude,
    mapView,
    redGraphicsLayer,
    pointsGraphicsLayer,
    selectedPoint,
  ]);

  useEffect(() => {
    return () => {
      clickHandleRef.current?.remove();
      redGraphicsLayer?.removeAll();

      const original = originalCoordsRef.current;
      if (!original || !mapView || !pointsGraphicsLayer || !selectedPoint) {
        return;
      }

      restoreOriginalPointGraphic({
        pointsGraphicsLayer,
        point: selectedPoint,
        longitude: original.longitude,
        latitude: original.latitude,
      });
    };
  }, [redGraphicsLayer, mapView, pointsGraphicsLayer, selectedPoint]);

  function handleSubmit() {
    if (!selectedPoint) return;

    const finalCoords = finalizeCoordinateValues(coordinateSystem, {
      longitude,
      latitude,
      xcoordinaat_rd,
      ycoordinaat_rd,
    });

    const payload = {
      ...selectedPoint,
      ...finalCoords,
      regio_id: selectedPoint.regio_id,
      vertrouwelijk: selectedPoint.vertrouwelijk,
      herhalen: selectedPoint.herhalen,
      user_id: selectedPoint.user_id,
      activiteit_id: selectedPoint.activiteit_id,
      organisatie_id: selectedPoint.organisatie_id,
      specifiek_letten_op: selectedPoint.specifiek_letten_op,
      datum: selectedPoint.datum,
      id: selectedPoint.id,
    };

    update(payload, (responseData) => {
      if (!responseData.result || !selectedPlan) return;

      const updatedPoint = { ...selectedPoint, ...finalCoords };
      setSelectedPoint(updatedPoint);
      setSelectedPlan({
        ...selectedPlan,
        points_data: [
          ...selectedPlan.points_data.filter((p) => p.id !== selectedPoint.id),
          updatedPoint,
        ],
      });

      if (mapView && pointsGraphicsLayer && yellowGraphicsLayer && redGraphicsLayer) {
        updateSavedGraphics({
          mapView,
          pointsGraphicsLayer,
          yellowGraphicsLayer,
          redGraphicsLayer,
          point: updatedPoint,
          longitude: finalCoords.longitude,
          latitude: finalCoords.latitude,
        });
      }

      setAction("form");
    });

    logAction({
      message: "User updated point coordinates",
      step: "Second step - Edit point coordinates",
      newData: { coordinateSystem, ...finalCoords },
    });
  }

  return {
    selectedPoint,
    loading,
    coordinateSystem,
    setCoordinateSystem,
    xcoordinaat_rd,
    setXCoordinaat_rd,
    ycoordinaat_rd,
    setYCoordinaat_rd,
    longitude,
    setLongitude,
    latitude,
    setLatitude,
    handleSubmit,
  };
}
