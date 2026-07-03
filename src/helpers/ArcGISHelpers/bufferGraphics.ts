import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Circle from "@arcgis/core/geometry/Circle";
import Point from "@arcgis/core/geometry/Point";
import * as bufferOperator from "@arcgis/core/geometry/operators/bufferOperator.js";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as projection from "@arcgis/core/geometry/projection";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import MapView from "@arcgis/core/views/MapView";
import { EnrichedPointType, FlightPlanType } from "Types";

const RED_BUFFER_SYMBOL = new SimpleFillSymbol({
  color: [255, 0, 0, 0.1],
  outline: { color: [255, 0, 0], width: 2 },
});

const BLUE_BUFFER_SYMBOL = new SimpleFillSymbol({
  color: [0, 0, 255, 0.1],
  outline: { color: [0, 0, 255], width: 2 },
});

type BufferUnit = "kilometers" | "meters";

export type BufferPointsOnLayerInput = {
  points: EnrichedPointType[];
  distance: number;
  unit: BufferUnit;
  graphicsLayer: GraphicsLayer;
  mapView: MapView;
};

export type BufferFlightPlansOnLayerInput = {
  flightPlans: FlightPlanType[];
  distance: number;
  unit: BufferUnit;
  graphicsLayer: GraphicsLayer;
};

function addBufferedGraphics(
  graphicsLayer: GraphicsLayer,
  buffered: __esri.Geometry | __esri.Geometry[],
  symbol: SimpleFillSymbol,
  id: number
) {
  const addGraphic = (geometry: __esri.Geometry) => {
    graphicsLayer.add(
      new Graphic({ geometry, symbol, attributes: { id } })
    );
  };

  if (Array.isArray(buffered)) buffered.forEach(addGraphic);
  else addGraphic(buffered);
}

export function bufferPointsOnLayer(input: BufferPointsOnLayerInput): void {
  input.points.forEach((point) => {
    const center = new Point({
      latitude: point.latitude,
      longitude: point.longitude,
      spatialReference: input.mapView.spatialReference,
    });

    const circle = new Circle({
      center,
      radius: input.distance,
      radiusUnit: input.unit,
      numberOfPoints: 64,
      spatialReference: input.mapView.spatialReference,
    });

    input.graphicsLayer.add(
      new Graphic({
        geometry: circle,
        symbol: RED_BUFFER_SYMBOL,
        attributes: { id: point.id },
      })
    );
  });
}

export function bufferFlightPlansOnLayer(
  input: BufferFlightPlansOnLayerInput
): void {
  input.flightPlans.forEach((plan) => {
    const points = plan.points;
    if (!Array.isArray(points) || points.length < 3) return;

    const polygonRings = points.map((pt) => [pt.longitude, pt.latitude]);
    const first = polygonRings[0];
    const last = polygonRings[polygonRings.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      polygonRings.push(first);
    }

    const projectedPolygon = projection.project(
      new Polygon({ rings: [polygonRings] }),
      SpatialReference.WebMercator
    ) as Polygon;

    const buffered = bufferOperator.execute(projectedPolygon, input.distance, {
      unit: input.unit,
    });
    if (!buffered) return;

    addBufferedGraphics(
      input.graphicsLayer,
      buffered,
      BLUE_BUFFER_SYMBOL,
      plan.id
    );
  });
}
