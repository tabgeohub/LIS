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

export function bufferPointsOnLayer(
  points: EnrichedPointType[],
  distance: number,
  unit: "kilometers" | "meters",
  graphicsLayer: GraphicsLayer,
  mapView: MapView
): void {
  points.forEach((point) => {
    const center = new Point({
      latitude: point.latitude,
      longitude: point.longitude,
      spatialReference: mapView.spatialReference,
    });

    const circle = new Circle({
      center,
      radius: distance,
      radiusUnit: unit,
      numberOfPoints: 64,
      spatialReference: mapView.spatialReference,
    });

    graphicsLayer.add(
      new Graphic({
        geometry: circle,
        symbol: RED_BUFFER_SYMBOL,
        attributes: { id: point.id },
      })
    );
  });
}

export function bufferFlightPlansOnLayer(
  flightPlans: FlightPlanType[],
  distance: number,
  unit: "kilometers" | "meters",
  graphicsLayer: GraphicsLayer
): void {
  flightPlans.forEach((plan) => {
    const points = plan.points;
    if (!Array.isArray(points) || points.length < 3) return;

    const polygonRings = points.map((pt) => [pt.longitude, pt.latitude]);
    const first = polygonRings[0];
    const last = polygonRings[polygonRings.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      polygonRings.push(first);
    }

    const polyg = new Polygon({ rings: [polygonRings] });
    const projectedPolygon = projection.project(
      polyg,
      SpatialReference.WebMercator
    ) as Polygon;

    const buffered = bufferOperator.execute(projectedPolygon, distance, {
      unit,
    });
    if (!buffered) return;

    const addGraphic = (geometry: __esri.Geometry) => {
      graphicsLayer.add(
        new Graphic({
          geometry,
          symbol: BLUE_BUFFER_SYMBOL,
          attributes: { id: plan.id },
        })
      );
    };

    if (Array.isArray(buffered)) {
      buffered.forEach(addGraphic);
    } else {
      addGraphic(buffered);
    }
  });
}
