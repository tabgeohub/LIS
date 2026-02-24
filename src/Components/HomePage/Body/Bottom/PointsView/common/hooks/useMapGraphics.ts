import { useEffect, RefObject } from "react";
import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features/useGeometriesStore";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import { createQuadrantGraphic } from "../../../../Left/Voorbereiding/ViewPlan/helpers/createQuadrantGraphic";

interface UseMapGraphicsParams {
  tab: string;
  pointsTable: EnrichedPointType[];
  geometriesTable: Geometry[];
  flightPlans: FlightPlanType[];
  starredPoints: EnrichedPointType[];
  starredGeometries: Geometry[];
  starredPlans: FlightPlanType[];
  graphicsLayer: any;
  graphicsLayerHover: any;
  yellowGraphicsLayer: any;
  mapView: any;
  originalGraphicsMap: RefObject<Map<number, Graphic>>;
}

export const useMapGraphics = ({
  tab,
  pointsTable,
  geometriesTable,
  flightPlans,
  starredPoints,
  starredGeometries,
  starredPlans,
  graphicsLayer,
  graphicsLayerHover,
  yellowGraphicsLayer,
  mapView,
  originalGraphicsMap,
}: UseMapGraphicsParams) => {
  useEffect(() => {
    graphicsLayer?.removeAll();
    yellowGraphicsLayer?.graphics.removeAll();

    if (tab === "points") {
      if (!mapView || !yellowGraphicsLayer) return;

      pointsTable.forEach((point) => {
        if (!point) return;

        const yellow = new SimpleMarkerSymbol({
          color: "yellow",
          size: 12,
          style: "circle",
          outline: { color: "white", width: 1 },
        });

        const geometry = new Point({
          longitude: point.longitude,
          latitude: point.latitude,
          spatialReference: { wkid: 4326 },
        });

        const graphic = new Graphic({
          geometry,
          symbol: yellow,
          attributes: point,
        });
        yellowGraphicsLayer.add(graphic);

        const alreadyStarred = starredPoints.find((p) => p.id === point.id);
        if (alreadyStarred) {
          const g = new Graphic({
            geometry: new Point({
              longitude: point.longitude,
              latitude: point.latitude,
            }),
            symbol: new SimpleMarkerSymbol({
              style: "circle",
              size: 14,
              color: [255, 255, 255, 0],
              outline: { color: [0, 0, 255, 1], width: 2 },
            }),
            attributes: { id: point.id },
          });
          graphicsLayer?.graphics.add(g);
        }
      });
    }

    if (tab === "geometries") {
      if (!mapView || !yellowGraphicsLayer || !geometriesTable) return;

      geometriesTable.forEach((geometry) => {
        if (!geometry.points || geometry.points.length === 0) return;

        const coordinates = geometry.points.map((point) => [
          point.longitude,
          point.latitude,
        ]);

        if (geometry.type === "polygon") {
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
            color: [255, 255, 0, 0.3],
            outline: {
              color: [255, 255, 0, 1],
              width: 2,
            },
          });

          yellowGraphicsLayer.add(
            new Graphic({
              geometry: polygon,
              symbol: fillSymbol,
              attributes: {
                geometryId: geometry.id,
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
            color: [255, 255, 0, 1],
            width: 3,
          });

          yellowGraphicsLayer.add(
            new Graphic({
              geometry: polyline,
              symbol: lineSymbol,
              attributes: {
                geometryId: geometry.id,
                type: "geometry",
              },
            })
          );
        }

        const alreadyStarred = starredGeometries.find(
          (g) => g.id === geometry.id
        );
        if (alreadyStarred) {
          // Starred geometries are already handled in GeometriesTable
        }
      });
    }

    if (tab === "flightPlans") {
      if (mapView && graphicsLayer) {
        graphicsLayer.removeAll();
        flightPlans?.forEach((plan) => {
          plan?.points.forEach(() => {
            const quadrantGraphic = createQuadrantGraphic(plan.points);
            quadrantGraphic.attributes = { id: plan.id };
            graphicsLayer.add(quadrantGraphic);
            originalGraphicsMap.current?.set(plan.id, quadrantGraphic);
          });

          const alreadyStarred = starredPlans.find((p) => p.id === plan.id);
          if (alreadyStarred) {
            const oldGraphic = originalGraphicsMap.current?.get(plan.id);
            if (oldGraphic) graphicsLayer?.remove(oldGraphic);

            const minLat = Math.min(...plan.points.map((p) => p.latitude));
            const maxLat = Math.max(...plan.points.map((p) => p.latitude));
            const minLon = Math.min(...plan.points.map((p) => p.longitude));
            const maxLon = Math.max(...plan.points.map((p) => p.longitude));

            const polygon = new Polygon({
              rings: [
                [
                  [minLon, maxLat],
                  [maxLon, maxLat],
                  [maxLon, minLat],
                  [minLon, minLat],
                  [minLon, maxLat],
                ],
              ],
              spatialReference: { wkid: 4326 },
            });

            const fillSymbol = new SimpleFillSymbol({
              color: [0, 255, 0, 0],
              outline: { color: [0, 0, 255, 1], width: 2 },
            });

            const graphic = new Graphic({
              geometry: polygon,
              symbol: fillSymbol,
            });
            graphicsLayer?.graphics.add(graphic);
          }
        });
      }
    }
  }, [
    tab,
    pointsTable,
    geometriesTable,
    flightPlans,
    starredPoints,
    starredGeometries,
    starredPlans,
    graphicsLayer,
    graphicsLayerHover,
    yellowGraphicsLayer,
    mapView,
    originalGraphicsMap,
  ]);
};

