import { useEffect, RefObject } from "react";
import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features/useGeometriesStore";
import Graphic from "@arcgis/core/Graphic";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import { createQuadrantGraphic } from "../../../../Left/Voorbereiding/ViewPlan/helpers/createQuadrantGraphic";
import { syncPointsTableMapGraphics } from "@helpers/ArcGISHelpers/createPointMapGraphics";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { addPlanStarGraphic } from "hooks/hover-click-handlers/usePlanStarGraphic";

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
      if (!validateMapView(mapView, yellowGraphicsLayer)) return;

      syncPointsTableMapGraphics({
        points: pointsTable,
        starredPoints,
        yellowGraphicsLayer,
        graphicsLayer,
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

            addPlanStarGraphic(plan, graphicsLayer, "table");
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

