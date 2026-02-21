/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import { getTransformedCoordinates } from "@helpers/ArcGISHelpers/getTransformedCoordinates";

/**
 * Hook to render plan geometries on the map
 * Always renders plan geometries when in Step2, regardless of action
 */
export function useRenderPlanGeometries() {
  const { selectedPlan } = useFinishedPlansState();
  const { mapView, geometriesGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView || !geometriesGraphicsLayer || !selectedPlan?.geometries) return;

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
  }, [selectedPlan?.geometries, mapView, geometriesGraphicsLayer]);
}

