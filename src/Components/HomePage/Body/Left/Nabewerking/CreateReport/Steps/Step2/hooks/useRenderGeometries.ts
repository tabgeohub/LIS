import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import useLogAction from "hooks/useLogAction";

export function useRenderGeometries(
  selectedPlan: FinishedFlightPlanType | null,
  selectedGeometries: number[]
) {
  const { mapView, geometriesGraphicsLayer } = useMapViewState();
  const logAction = useLogAction();

  useEffect(() => {
    if (!mapView || !selectedPlan || !geometriesGraphicsLayer) return;

    geometriesGraphicsLayer.removeAll();

    const graphics: Graphic[] = [];

    // First, render all geometries in blue
    selectedPlan.geometries?.forEach((geometry) => {
      if (!geometry.points || geometry.points.length === 0) return;

      const coordinates = geometry.points.map((point) => [
        point.longitude,
        point.latitude,
      ]);

      if (geometry.geometry_type === "polygon") {
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

        // Blue symbol for all geometries
        const blueSymbol = new SimpleFillSymbol({
          color: [0, 0, 0, 0], // Transparent fill
          outline: {
            color: [0, 0, 255, 1], // Blue outline
            width: 2,
          },
        });

        graphics.push(
          new Graphic({
            geometry: polygon,
            symbol: blueSymbol,
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

        // Blue symbol for all geometries
        const blueSymbol = new SimpleLineSymbol({
          color: [0, 0, 255, 1], // Blue
          width: 3,
        });

        graphics.push(
          new Graphic({
            geometry: polyline,
            symbol: blueSymbol,
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

    // Then, overlay selected geometries in yellow on top
    if (selectedGeometries.length > 0) {
      selectedPlan.geometries
        ?.filter((geometry) => selectedGeometries.includes(geometry.id))
        .forEach((geometry) => {
          if (!geometry.points || geometry.points.length === 0) return;

          const coordinates = geometry.points.map((point) => [
            point.longitude,
            point.latitude,
          ]);

          if (geometry.geometry_type === "polygon") {
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

            const yellowSymbol = new SimpleFillSymbol({
              color: [0, 0, 0, 0],
              outline: {
                color: [255, 255, 0, 1],
                width: 3,
              },
            });

            graphics.push(
              new Graphic({
                geometry: polygon,
                symbol: yellowSymbol,
                attributes: {
                  ...geometry,
                  isSelected: true,
                },
              })
            );
          } else if (geometry.geometry_type === "line") {
            const polyline = new Polyline({
              paths: [coordinates],
              spatialReference: { wkid: 4326 },
            });

            const yellowSymbol = new SimpleLineSymbol({
              color: [255, 255, 0, 1],
              width: 4,
            });

            graphics.push(
              new Graphic({
                geometry: polyline,
                symbol: yellowSymbol,
                attributes: {
                  ...geometry,
                  isSelected: true,
                },
              })
            );
          }
        });
    }

    if (graphics.length > 0) {
      geometriesGraphicsLayer.addMany(graphics);
    }

    logAction({
      message: "User selected geometries",
      step: "First step",
      newData: {
        geometries: selectedGeometries,
      },
    });
  }, [
    selectedGeometries,
    mapView,
    selectedPlan,
    geometriesGraphicsLayer,
    logAction,
  ]);
}



