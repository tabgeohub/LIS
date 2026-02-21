/* eslint-disable react-hooks/exhaustive-deps */
import Buttons from "./Buttons";
import { useEffect, useState } from "react";
import NoneAction from "./Actions/NoneAction";
import EditFlight from "./Actions/EditFlight";
import VliegrouteExporteren from "./Actions/VliegrouteExporteren";
import Waarnemingen from "./Actions/Waarnemingen";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { usePointsStore } from "hooks/features/usePointsStore";
import useDrawPath from "hooks/hover-click-handlers/useDrawPath";
import { useReadData } from "utils/useReadData";
import { FinishedFlightPlanType } from "Types/finished_plans";
import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";
import { useContent } from "hooks/useContent";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";

export type ActionType =
  | "none"
  | "waarnemingen"
  | "vluchtBewerken"
  | "vliegroute";

export default function Step2() {
  const [action, setAction] = useState<ActionType>("none");

  const { selectedPlan, setSelectedPlan } = useFinishedPlansState();

  const content = useContent();

  const { points, setPoints } = usePointsStore();

  const { mapView, pointsGraphicsLayer, geometriesGraphicsLayer } = useMapViewState();

  const { data: finishedPlan, loading: finishedPlanLoading } = useReadData<FinishedFlightPlanType>(
    "/finished_plans/getSingleFinishedFlightPlan/" + selectedPlan?.id
  );

  const { loadingPath } = useDrawPath(finishedPlanLoading);

  useEffect(() => {
    const planPointsIds = selectedPlan?.points_data.flatMap(
      (point) => point.id
    );

    const filteredPoints = points.filter((point) =>
      planPointsIds?.includes(point.id)
    );

    setPoints(filteredPoints);
  }, []);

  useEffect(() => {
    if (!finishedPlan) return;

    setSelectedPlan(finishedPlan);
  }, [finishedPlan]);

  // Render points directly from points_data to ensure "Ad hoc" points are included
  // Only render plan points when action is not "none" (i.e., when in a specific action view)
  useEffect(() => {
    if (!mapView || !pointsGraphicsLayer || !selectedPlan?.points_data) return;
    // When action is "none", let useRenderPoints handle rendering all points
    if (action === "none") return;

    pointsGraphicsLayer.removeAll();

    const blueSymbol = new SimpleMarkerSymbol({
      color: "blue",
      size: 12,
      style: "circle",
      outline: {
        color: "white",
        width: 1,
      },
    });

    const graphics: __esri.Graphic[] = [];

    selectedPlan.points_data.forEach((point) => {
      if (!point) return;

      // Get coordinates - prefer WGS84, fallback to RD transformation
      let longitude: number | undefined = point.longitude;
      let latitude: number | undefined = point.latitude;

      if (
        (typeof longitude !== "number" || typeof latitude !== "number") &&
        typeof point.xcoordinaat_rd === "number" &&
        typeof point.ycoordinaat_rd === "number"
      ) {
        const wgs = getTransformedCoordinates(
          "RD",
          "WGS84",
          point.xcoordinaat_rd,
          point.ycoordinaat_rd
        );
        longitude = wgs.x;
        latitude = wgs.y;
      }

      if (typeof longitude !== "number" || typeof latitude !== "number") {
        return;
      }

      const geometry = new Point({
        longitude,
        latitude,
        spatialReference: { wkid: 4326 },
      });

      const graphic = new Graphic({
        geometry,
        symbol: blueSymbol,
        attributes: point,
      });

      graphics.push(graphic);
    });

    if (graphics.length > 0) {
      pointsGraphicsLayer.addMany(graphics);
    }
  }, [selectedPlan?.points_data, mapView, pointsGraphicsLayer, action]);

  // Render geometries directly from selectedPlan.geometries to ensure only plan geometries are shown
  // Only render plan geometries when action is not "none" (i.e., when in a specific action view)
  useEffect(() => {
    if (!mapView || !geometriesGraphicsLayer || !selectedPlan?.geometries) return;
    // When action is "none", let useRenderGeometries handle rendering all geometries
    if (action === "none") return;

    geometriesGraphicsLayer.removeAll();

    const graphics: __esri.Graphic[] = [];

    selectedPlan.geometries.forEach((geometry) => {
      if (!geometry.points || geometry.points.length === 0) return;

      // Convert points to coordinate arrays
      const coordinates = geometry.points.map((point) => {
        // Get coordinates - prefer WGS84, fallback to RD transformation
        let longitude: number | undefined = point.longitude;
        let latitude: number | undefined = point.latitude;

        if (
          (typeof longitude !== "number" || typeof latitude !== "number") &&
          typeof point.xcoordinaat_rd === "number" &&
          typeof point.ycoordinaat_rd === "number"
        ) {
          const wgs = getTransformedCoordinates(
            "RD",
            "WGS84",
            point.xcoordinaat_rd,
            point.ycoordinaat_rd
          );
          longitude = wgs.x;
          latitude = wgs.y;
        }

        if (typeof longitude !== "number" || typeof latitude !== "number") {
          return null;
        }

        return [longitude, latitude];
      }).filter((coord): coord is [number, number] => coord !== null);

      if (coordinates.length === 0) return;

      if (geometry.geometry_type === "polygon") {
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
          color: [0, 0, 0, 0], // Empty inside (fully transparent)
          outline: {
            color: [0, 0, 255, 1], // Blue outline
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
              omschrijving: geometry.geometry_omschrijving,
              type: "geometry",
            },
          })
        );
      } else if (geometry.geometry_type === "line") {
        const polyline = new Polyline({
          paths: [coordinates],
          spatialReference: { wkid: 4326 },
        });

        const lineSymbol = new SimpleLineSymbol({
          color: [0, 0, 255, 1], // Blue
          width: 3,
        });

        graphics.push(
          new Graphic({
            geometry: polyline,
            symbol: lineSymbol,
            attributes: {
              geometryId: geometry.id,
              geometryType: "line",
              omschrijving: geometry.geometry_omschrijving,
              type: "geometry",
            },
          })
        );
      }
    });

    if (graphics.length > 0) {
      geometriesGraphicsLayer.addMany(graphics);
    }
  }, [selectedPlan?.geometries, mapView, geometriesGraphicsLayer, action]);

  return (
    <div className="p-1.5 h-full">
      {action === "none" && (
        <>
          <NoneAction />

          <Buttons setAction={setAction} />
        </>
      )}

      {action === "vluchtBewerken" && <EditFlight setAction={setAction} />}

      {action === "waarnemingen" && <Waarnemingen setAction={setAction} />}

      {action === "vliegroute" && (
        <VliegrouteExporteren setAction={setAction} />
      )}

      {loadingPath && (
        <div className="flex flex-col bg-gray-200 items-center -space-y-2 mt-4 w-fit px-4 py-8 rounded-xl mx-auto z-10 relative">
          <p className="text-primary font-semibold text-lg animate-pulse">
            {content.nabewerking.vluchtenZoeken.step2.loadingPath}
          </p>
          <LoadingBars />
        </div>
      )}
    </div>
  );
}
