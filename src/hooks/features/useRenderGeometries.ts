/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import { useGeometriesStore, Geometry } from "./useGeometriesStore";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";

export function useRenderGeometries() {
  const { user } = useAuth();
  const { map, geometriesGraphicsLayer } = useMapViewState();
  const { geometries, fetchGeometries } = useGeometriesStore();
  const { step } = useFinishedPlansState();

  // Fetch geometries
  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;

    // Only fetch once - fetchGeometries now populates both geometries and dbGeometries
    fetchGeometries({
      regio: user.role && user.role !== "admin" ? user.role : undefined,
    });
  }, [user.user_id, user.role]);

  // Render geometries on the map
  useEffect(() => {
    if (!map || !geometriesGraphicsLayer || !geometries || geometries.length === 0) return;
    if (user.user_id === undefined || user.user_id === 0) return;
    // Skip rendering when in Step2 - useRenderPlanGeometries handles rendering plan geometries
    if (step === 2) return;

    // Clear existing geometry graphics
    geometriesGraphicsLayer.removeAll();

    const graphics: Graphic[] = [];

    geometries.forEach((geometry) => {
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
              omschrijving: geometry.omschrijving,
              type: "geometry",
              organisatie: geometry.organisatie,
              vertrouwelijk: geometry.vertrouwelijk,
              herhalen: geometry.herhalen,
              activiteit: geometry.activiteit,
              specifiek_letten_op: geometry.specifiek_letten_op,
              regio_id: geometry.regio_id,
            },
          })
        );
      } else if (geometry.type === "line") {
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
              omschrijving: geometry.omschrijving,
              type: "geometry",
              organisatie: geometry.organisatie,
              vertrouwelijk: geometry.vertrouwelijk,
              herhalen: geometry.herhalen,
              activiteit: geometry.activiteit,
              specifiek_letten_op: geometry.specifiek_letten_op,
              regio_id: geometry.regio_id,
            },
          })
        );
      }
    });

    // Add all geometry graphics to the layer
    if (graphics.length > 0) {
      geometriesGraphicsLayer.addMany(graphics);
    }

    // Cleanup: remove geometry graphics when component unmounts or geometries change
    return () => {
      if (geometriesGraphicsLayer) {
        geometriesGraphicsLayer.removeAll();
      }
    };
  }, [map, geometriesGraphicsLayer, geometries, user, step]);
}

