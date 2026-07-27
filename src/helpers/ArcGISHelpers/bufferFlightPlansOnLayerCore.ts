import * as bufferOperator from "@arcgis/core/geometry/operators/bufferOperator.js";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as projection from "@arcgis/core/geometry/projection";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { FlightPlanType } from "Types";
import {
  addBufferedGraphics,
  BLUE_BUFFER_SYMBOL,
  type BufferUnit,
} from "./bufferPointsOnLayer";

export type BufferFlightPlansOnLayerInput = {
  flightPlans: FlightPlanType[];
  distance: number;
  unit: BufferUnit;
  graphicsLayer: GraphicsLayer;
};

function closedPolygonRings(
  points: Array<{ longitude: number; latitude: number }>
): number[][] {
  const polygonRings = points.map((pt) => [pt.longitude, pt.latitude]);
  const first = polygonRings[0];
  const last = polygonRings[polygonRings.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    polygonRings.push(first);
  }
  return polygonRings;
}

function bufferSingleFlightPlan(input: {
  plan: FlightPlanType;
  distance: number;
  unit: BufferUnit;
  graphicsLayer: GraphicsLayer;
}): void {
  const points = input.plan.points;
  if (!Array.isArray(points) || points.length < 3) return;

  const projectedPolygon = projection.project(
    new Polygon({ rings: [closedPolygonRings(points)] }),
    SpatialReference.WebMercator
  ) as Polygon;

  const buffered = bufferOperator.execute(projectedPolygon, input.distance, {
    unit: input.unit,
  });
  if (!buffered) return;

  addBufferedGraphics({
    graphicsLayer: input.graphicsLayer,
    buffered,
    symbol: BLUE_BUFFER_SYMBOL,
    id: input.plan.id,
  });
}

export function bufferFlightPlansOnLayer(
  input: BufferFlightPlansOnLayerInput
): void {
  input.flightPlans.forEach((plan) =>
    bufferSingleFlightPlan({
      plan,
      distance: input.distance,
      unit: input.unit,
      graphicsLayer: input.graphicsLayer,
    })
  );
}
