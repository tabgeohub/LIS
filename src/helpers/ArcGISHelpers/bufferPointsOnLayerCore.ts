import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Circle from "@arcgis/core/geometry/Circle";
import Point from "@arcgis/core/geometry/Point";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import MapView from "@arcgis/core/views/MapView";
import { EnrichedPointType } from "Types";

export const RED_BUFFER_SYMBOL = new SimpleFillSymbol({
  color: [255, 0, 0, 0.1],
  outline: { color: [255, 0, 0], width: 2 },
});

export const BLUE_BUFFER_SYMBOL = new SimpleFillSymbol({
  color: [0, 0, 255, 0.1],
  outline: { color: [0, 0, 255], width: 2 },
});

export type BufferUnit = "kilometers" | "meters";

export function addBufferedGraphics(input: {
  graphicsLayer: GraphicsLayer;
  buffered: __esri.Geometry | __esri.Geometry[];
  symbol: SimpleFillSymbol;
  id: number;
}) {
  const { graphicsLayer, buffered, symbol, id } = input;
  const addGraphic = (geometry: __esri.Geometry) => {
    graphicsLayer.add(
      new Graphic({ geometry, symbol, attributes: { id } })
    );
  };

  if (Array.isArray(buffered)) buffered.forEach(addGraphic);
  else addGraphic(buffered);
}

export type BufferPointsOnLayerInput = {
  points: EnrichedPointType[];
  distance: number;
  unit: BufferUnit;
  graphicsLayer: GraphicsLayer;
  mapView: MapView;
};

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
