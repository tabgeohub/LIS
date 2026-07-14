/* eslint-disable react-hooks/exhaustive-deps */
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import { useEffect } from "react";
import {
  createGeometryGraphic,
  GeometrySymbolOptions,
} from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { usePointsStore } from "hooks/features/usePointsStore";
import { FlightPlanType } from "Types";

const yellowGeometrySymbol: GeometrySymbolOptions = {
  fillColor: [255, 255, 0, 0.3],
  outlineColor: [255, 255, 0, 1],
  lineColor: [255, 255, 0, 1],
  outlineWidth: 2,
  lineWidth: 3,
};

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
    const layer = layers.yellowGraphicsLayer;
    if (!validateMapView(layers.mapView, layer) || !layer || !geometriesTable?.length) {
      return;
    }
    layer.graphics
      .toArray()
      .filter((graphic) => graphic.attributes?.type === "geometry")
      .forEach((graphic) => layer.remove(graphic));

    const graphics = geometriesTable.flatMap((geometry) => {
      if (!geometry.points?.length) return [];
      const graphic = createGeometryGraphic(geometry, {
        symbolOptions: yellowGeometrySymbol,
        attributes: {
          geometryId: geometry.id,
          geometryType: geometry.type,
          omschrijving: geometry.omschrijving,
          type: "geometry",
        },
      });
      return graphic ? [graphic as Graphic] : [];
    });
    if (graphics.length) layer.addMany(graphics);
  }, [layers.mapView, layers.yellowGraphicsLayer, geometriesTable]);

  const selectTargetPoint = (index: number) => {
    input.setClickedPoint(index);
    if (!validateMapView(layers.mapView) || !layers.mapView) return;
    layers.mapView.zoom = 15;
    layers.mapView.goTo(
      new Point({
        longitude: pointsTable[index].longitude,
        latitude: pointsTable[index].latitude,
      })
    );
  };

  const selectTargetGeometry = (geometryId: number) => {
    input.setClickedGeometry(geometryId);
    if (!validateMapView(layers.mapView) || !layers.mapView) return;
    const geometry = geometriesTable?.find((item) => item.id === geometryId);
    if (!geometry?.points?.length) return;
    const center = geometry.points.reduce(
      (sum, point) => ({
        longitude: sum.longitude + point.longitude,
        latitude: sum.latitude + point.latitude,
      }),
      { longitude: 0, latitude: 0 }
    );
    layers.mapView.zoom = 12;
    layers.mapView.goTo(
      new Point({
        longitude: center.longitude / geometry.points.length,
        latitude: center.latitude / geometry.points.length,
        spatialReference: { wkid: 4326 },
      })
    );
  };

  return { selectTargetPoint, selectTargetGeometry };
}
