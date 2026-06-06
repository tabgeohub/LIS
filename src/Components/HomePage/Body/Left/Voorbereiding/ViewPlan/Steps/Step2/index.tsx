/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import Form from "./Form";
import PointsList from "./PointsList";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useEffect } from "react";
import Point from "@arcgis/core/geometry/Point";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import PointsAdding from "./PointsAdding";
import Graphic from "@arcgis/core/Graphic";
import { createGeometryGraphic } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";

export default function Step2({
  vluchtnummer,
  setVluchtnummer,
  handleCancel,
  refetch,
}: {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
  handleCancel: () => void;
  refetch: () => void;
}) {
  const { mapView, graphicsLayer, graphicsLayerHover, yellowGraphicsLayer, geometriesGraphicsLayer } = useMapViewState();
  const { setOpenTable, pointsTable, geometriesTable } = useOpenTable();

  const { clickedPoint, setClickedPoint, clickedGeometry, setClickedGeometry, setStep, selectedPlan } =
    useViewPlanState();
  const { setPoints } = usePointsStore();
  const { setGeometries } = useGeometriesStore();

  useEffect(() => {
    if (!validateMapView(mapView) || !selectedPlan) return;

    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();
    geometriesGraphicsLayer?.removeAll(); // Clear global geometries layer

    setOpenTable(true);

    mapView?.graphics.removeAll();

    setPoints(selectedPlan.points);
    setGeometries(selectedPlan.geometries || []);
  }, [clickedPoint]);

  // Render geometries from geometriesTable as yellow on the map
  useEffect(() => {
    if (!validateMapView(mapView, yellowGraphicsLayer) || !geometriesTable || geometriesTable.length === 0) return;
    if (!yellowGraphicsLayer) return; // Type guard

    // Clear existing yellow geometry graphics (but keep point graphics)
    const existingGraphics = yellowGraphicsLayer.graphics.toArray();
    const geometryGraphics = existingGraphics.filter(
      (g) => g.attributes?.type === "geometry"
    );
    geometryGraphics.forEach((g) => yellowGraphicsLayer.remove(g));

    const graphics: Graphic[] = [];

    geometriesTable.forEach((geometry) => {
      if (!geometry.points || geometry.points.length === 0) return;

      const graphic = createGeometryGraphic(geometry, {
        symbolOptions: {
          fillColor: [255, 255, 0, 0.3], // Yellow fill with transparency
          outlineColor: [255, 255, 0, 1], // Yellow outline
          lineColor: [255, 255, 0, 1], // Yellow line
          outlineWidth: 2,
          lineWidth: 3,
        },
        attributes: {
          geometryId: geometry.id,
          geometryType: geometry.type,
          omschrijving: geometry.omschrijving,
          type: "geometry",
        },
      });

      if (graphic) {
        graphics.push(graphic);
      }
    });

    // Add all geometry graphics to the yellow layer
    if (graphics.length > 0) {
      yellowGraphicsLayer.addMany(graphics);
    }
  }, [mapView, yellowGraphicsLayer, geometriesTable]);

  const selectTargetPoint = (index: number) => {
    setClickedPoint(index);

    if (validateMapView(mapView) && mapView) {
      mapView.zoom = 15;

      const pt = new Point({
        longitude: pointsTable[index].longitude,
        latitude: pointsTable[index].latitude,
      });

      mapView.goTo(pt);
    }
  };

  const selectTargetGeometry = (geometryId: number) => {
    setClickedGeometry(geometryId);

    if (!validateMapView(mapView) || !geometriesTable || !mapView) return;

    const geometry = geometriesTable.find((g) => g.id === geometryId);
    if (!geometry || !geometry.points || geometry.points.length === 0) return;

    // Calculate centroid (center) of the geometry
    const sum = geometry.points.reduce(
      (acc, point) => {
        acc.lon += point.longitude;
        acc.lat += point.latitude;
        return acc;
      },
      { lon: 0, lat: 0 }
    );

    const centerLon = sum.lon / geometry.points.length;
    const centerLat = sum.lat / geometry.points.length;

    // Zoom to the center (lower zoom for better view of geometry)
    mapView.zoom = 12;

    const centerPoint = new Point({
      longitude: centerLon,
      latitude: centerLat,
      spatialReference: { wkid: 4326 },
    });

    mapView.goTo(centerPoint);
  };

  return (
    <ScrollButtonsLayout
      className="h-full"
      buttons={
        <Buttons
          vluchtnummer={vluchtnummer}
          handleCancel={handleCancel}
          refetch={refetch}
        />
      }
    >
      <div className="py-4 px-2 space-y-4">
        <Form vluchtnummer={vluchtnummer} setVluchtnummer={setVluchtnummer} />

        <PointsList
          clickedPoint={clickedPoint}
          clickedGeometry={clickedGeometry}
          selectTargetPoint={selectTargetPoint}
          selectTargetGeometry={selectTargetGeometry}
        />
      </div>

      <div className="h-[2px] bg-gray-200 my-4" />

      <PointsAdding setStep={setStep} />
    </ScrollButtonsLayout>
  );
}
