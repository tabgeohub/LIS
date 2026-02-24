/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import Form from "./Form";
import PointsList from "./PointsList";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useEffect } from "react";
import Point from "@arcgis/core/geometry/Point";
import { useViewPlanState } from "../../helpers/useViewPlanState";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import PointsAdding from "./PointsAdding";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

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
    if (!mapView) return;
    if (!selectedPlan) return;

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
    if (!mapView || !yellowGraphicsLayer || !geometriesTable || geometriesTable.length === 0) return;

    // Clear existing yellow geometry graphics (but keep point graphics)
    const existingGraphics = yellowGraphicsLayer.graphics.toArray();
    const geometryGraphics = existingGraphics.filter(
      (g) => g.attributes?.type === "geometry"
    );
    geometryGraphics.forEach((g) => yellowGraphicsLayer.remove(g));

    const graphics: Graphic[] = [];

    geometriesTable.forEach((geometry) => {
      if (!geometry.points || geometry.points.length === 0) return;

      // Convert points to coordinate arrays
      const coordinates = geometry.points.map((point) => [
        point.longitude,
        point.latitude,
      ]);

      if (geometry.type === "polygon") {
        // For polygons, ensure the ring is closed (first point = last point)
        const ring = [...coordinates];
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          ring.push([first[0], first[1]]);
        }

        const polygon = new Polygon({
          rings: [ring],
          spatialReference: { wkid: 4326 },
        });

        const fillSymbol = new SimpleFillSymbol({
          color: [255, 255, 0, 0.3], // Yellow fill with transparency
          outline: {
            color: [255, 255, 0, 1], // Yellow outline
            width: 2,
          },
        });

        graphics.push(
          new Graphic({
            geometry: polygon,
            symbol: fillSymbol,
            attributes: {
              geometryId: geometry.id,
              geometryType: "polygon",
              omschrijving: geometry.omschrijving,
              type: "geometry",
            },
          })
        );
      } else if (geometry.type === "line") {
        const polyline = new Polyline({
          paths: [coordinates],
          spatialReference: { wkid: 4326 },
        });

        const lineSymbol = new SimpleLineSymbol({
          color: [255, 255, 0, 1], // Yellow
          width: 3,
        });

        graphics.push(
          new Graphic({
            geometry: polyline,
            symbol: lineSymbol,
            attributes: {
              geometryId: geometry.id,
              geometryType: "line",
              omschrijving: geometry.omschrijving,
              type: "geometry",
            },
          })
        );
      }
    });

    // Add all geometry graphics to the yellow layer
    if (graphics.length > 0) {
      yellowGraphicsLayer.addMany(graphics);
    }
  }, [mapView, yellowGraphicsLayer, geometriesTable]);

  const selectTargetPoint = (index: number) => {
    setClickedPoint(index);

    if (mapView) {
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

    if (!mapView || !geometriesTable) return;

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
