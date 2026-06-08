import { useEffect, RefObject } from "react";
import Graphic from "@arcgis/core/Graphic";
import { EnrichedPointType, FlightPlanType } from "Types";
import { Geometry } from "hooks/features/useGeometriesStore";
import { createQuadrantGraphic } from "../../../../Left/Voorbereiding/ViewPlan/helpers/createQuadrantGraphic";
import { syncGeometriesTableMapGraphics } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
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

      syncGeometriesTableMapGraphics({
        geometries: geometriesTable,
        starredGeometries,
        yellowGraphicsLayer,
        graphicsLayer,
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

