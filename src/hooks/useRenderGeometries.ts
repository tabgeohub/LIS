/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import { useGeometriesStore, Geometry } from "./zustand/useGeometriesStore";

export function useRenderGeometries() {
  const { user } = useAuth();
  const { map, graphicsLayer } = useMapViewState();
  const { geometries, fetchGeometries } = useGeometriesStore();

  // Fetch geometries
  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;

    fetchGeometries({
      regio: user.role && user.role !== "admin" ? user.role : undefined,
    });
  }, [user]);

  // Render geometries on the map
  useEffect(() => {
    if (!map || !graphicsLayer || !geometries || geometries.length === 0) return;
    if (user.user_id === undefined || user.user_id === 0) return;

    // Clear existing geometry graphics (but keep other graphics)
    // We'll need to track which graphics are geometries, or use a separate layer
    // For now, let's create a dedicated approach

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
            color: [255, 0, 0, 1], // Red outline
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
          color: [0, 255, 0, 1], // Green
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
      graphicsLayer.addMany(graphics);
    }

    // Cleanup: remove geometry graphics when component unmounts or geometries change
    return () => {
      if (graphicsLayer) {
        // Remove only geometry graphics by checking attributes
        const graphicsToRemove: Graphic[] = [];
        graphicsLayer.graphics.forEach((g) => {
          if (g.attributes?.type === "geometry") {
            graphicsToRemove.push(g);
          }
        });
        graphicsToRemove.forEach((g) => graphicsLayer.remove(g));
      }
    };
  }, [map, graphicsLayer, geometries, user]);
}

