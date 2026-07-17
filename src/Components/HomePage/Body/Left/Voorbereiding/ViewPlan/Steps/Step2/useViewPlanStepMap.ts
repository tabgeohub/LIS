/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { usePointsStore } from "hooks/features/usePointsStore";
import { FlightPlanType } from "Types";
import {
  goToGeometryCenter,
  goToTablePoint,
  syncYellowGeometryTableGraphics,
} from "./viewPlanStepMapActions";

export function useViewPlanStepMap(input: {
  selectedPlan: FlightPlanType | null;
  clickedPoint: number;
  setClickedPoint: (index: number) => void;
  setClickedGeometry: (id: number) => void;
}) {
  const layers = useMapViewState();
  const { setOpenTable, pointsTable, geometriesTable } = useOpenTable();
  const { setPoints } = usePointsStore();
  const { setGeometries } = useGeometriesStore();

  useEffect(() => {
    if (!validateMapView(layers.mapView) || !input.selectedPlan) return;
    layers.graphicsLayer?.removeAll();
    layers.graphicsLayerHover?.removeAll();
    layers.geometriesGraphicsLayer?.removeAll();
    setOpenTable(true);
    layers.mapView?.graphics.removeAll();
    setPoints(input.selectedPlan.points);
    setGeometries(input.selectedPlan.geometries || []);
  }, [input.clickedPoint]);

  useEffect(() => {
    syncYellowGeometryTableGraphics({
      mapView: layers.mapView,
      yellowGraphicsLayer: layers.yellowGraphicsLayer,
      geometriesTable,
    });
  }, [layers.mapView, layers.yellowGraphicsLayer, geometriesTable]);

  const selectTargetPoint = (index: number) => {
    input.setClickedPoint(index);
    goToTablePoint({
      mapView: layers.mapView,
      longitude: pointsTable[index].longitude,
      latitude: pointsTable[index].latitude,
    });
  };

  const selectTargetGeometry = (geometryId: number) => {
    input.setClickedGeometry(geometryId);
    const geometry = geometriesTable?.find((item) => item.id === geometryId);
    if (!geometry?.points?.length) return;
    goToGeometryCenter({
      mapView: layers.mapView,
      points: geometry.points,
    });
  };

  return { selectTargetPoint, selectTargetGeometry };
}
