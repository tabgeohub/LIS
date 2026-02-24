/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import { Geometry } from "./useGeometriesStore";

/**
 * Hook to render geometries locally on the map (for component-specific rendering)
 * @param geometries - Array of geometries to render
 */
export function useRenderLocalGeometries(geometries: Geometry[]) {
  const { mapView, geometriesGraphicsLayer } = useMapViewState();

  useEffect(() => {
    if (!mapView || !geometriesGraphicsLayer) return;

    geometriesGraphicsLayer.removeAll();

    if (!geometries.length) return;

    const graphics: __esri.Graphic[] = [];

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
              id: geometry.id,
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
          color: [0, 0, 255, 1], // Blue
          width: 3,
        });

        graphics.push(
          new Graphic({
            geometry: polyline,
            symbol: lineSymbol,
            attributes: {
              id: geometry.id,
              geometryId: geometry.id,
              geometryType: "line",
              omschrijving: geometry.omschrijving,
              type: "geometry",
            },
          })
        );
      }
    });

    if (graphics.length > 0) {
      geometriesGraphicsLayer.addMany(graphics);
    }

    // Cleanup on unmount
    return () => {
      geometriesGraphicsLayer.removeAll();
    };
  }, [geometries, mapView, geometriesGraphicsLayer]);
}

