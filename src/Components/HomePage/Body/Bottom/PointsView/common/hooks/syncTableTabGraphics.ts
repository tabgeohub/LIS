import type { RefObject } from "react";
import Graphic from "@arcgis/core/Graphic";
import type { EnrichedPointType, FlightPlanType } from "Types";
import type { Geometry } from "hooks/features/useGeometriesStore";
import { createQuadrantGraphic } from "../../../../Left/Voorbereiding/ViewPlan/helpers/createQuadrantGraphic";
import { syncGeometriesTableMapGraphics } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { syncPointsTableMapGraphics } from "@helpers/ArcGISHelpers/createPointMapGraphics";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { addPlanStarGraphic } from "@helpers/ArcGISHelpers/planStarGraphics";

type GraphicsContext = {
  graphicsLayer: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  mapView: __esri.MapView | null;
  originalGraphicsMap: RefObject<Map<number, Graphic>>;
};

export function syncPointsTabGraphics(input: {
  ctx: GraphicsContext;
  pointsTable: EnrichedPointType[];
  starredPoints: EnrichedPointType[];
}) {
  if (!validateMapView(input.ctx.mapView, input.ctx.yellowGraphicsLayer)) return;
  syncPointsTableMapGraphics({
    points: input.pointsTable,
    starredPoints: input.starredPoints,
    yellowGraphicsLayer: input.ctx.yellowGraphicsLayer!,
    graphicsLayer: input.ctx.graphicsLayer,
  });
}

export function syncGeometriesTabGraphics(input: {
  ctx: GraphicsContext;
  geometriesTable: Geometry[];
  starredGeometries: Geometry[];
}) {
  if (!input.ctx.mapView || !input.ctx.yellowGraphicsLayer || !input.geometriesTable) return;
  syncGeometriesTableMapGraphics({
    geometries: input.geometriesTable,
    starredGeometries: input.starredGeometries,
    yellowGraphicsLayer: input.ctx.yellowGraphicsLayer,
    graphicsLayer: input.ctx.graphicsLayer,
  });
}

export function syncFlightPlansTabGraphics(input: {
  ctx: GraphicsContext;
  flightPlans: FlightPlanType[];
  starredPlans: FlightPlanType[];
}) {
  if (!input.ctx.mapView || !input.ctx.graphicsLayer) return;

  input.ctx.graphicsLayer.removeAll();
  input.flightPlans?.forEach((plan) => {
    plan?.points.forEach(() => {
      const quadrantGraphic = createQuadrantGraphic(plan.points);
      quadrantGraphic.attributes = { id: plan.id };
      input.ctx.graphicsLayer!.add(quadrantGraphic);
      input.ctx.originalGraphicsMap.current?.set(plan.id, quadrantGraphic);
    });

    if (input.starredPlans.find((p) => p.id === plan.id)) {
      const oldGraphic = input.ctx.originalGraphicsMap.current?.get(plan.id);
      if (oldGraphic) input.ctx.graphicsLayer?.remove(oldGraphic);
      addPlanStarGraphic({
        plan,
        layer: input.ctx.graphicsLayer!,
        variant: "table",
      });
    }
  });
}

const TAB_GRAPHICS_SYNC: Record<
  string,
  (input: {
    ctx: GraphicsContext;
    pointsTable: EnrichedPointType[];
    geometriesTable: Geometry[];
    flightPlans: FlightPlanType[];
    starredPoints: EnrichedPointType[];
    starredGeometries: Geometry[];
    starredPlans: FlightPlanType[];
  }) => void
> = {
  points: (input) =>
    syncPointsTabGraphics({
      ctx: input.ctx,
      pointsTable: input.pointsTable,
      starredPoints: input.starredPoints,
    }),
  geometries: (input) =>
    syncGeometriesTabGraphics({
      ctx: input.ctx,
      geometriesTable: input.geometriesTable,
      starredGeometries: input.starredGeometries,
    }),
  flightPlans: (input) =>
    syncFlightPlansTabGraphics({
      ctx: input.ctx,
      flightPlans: input.flightPlans,
      starredPlans: input.starredPlans,
    }),
};

export function syncTableTabGraphics(input: {
  tab: string;
  ctx: GraphicsContext;
  pointsTable: EnrichedPointType[];
  geometriesTable: Geometry[];
  flightPlans: FlightPlanType[];
  starredPoints: EnrichedPointType[];
  starredGeometries: Geometry[];
  starredPlans: FlightPlanType[];
}) {
  input.ctx.graphicsLayer?.removeAll();
  input.ctx.yellowGraphicsLayer?.graphics.removeAll();
  TAB_GRAPHICS_SYNC[input.tab]?.(input);
}
