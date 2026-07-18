import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Circle from "@arcgis/core/geometry/Circle";
import { bufferCenterPoint } from "./bufferCenterPoint";

type BufferPoint = {
  id: number;
  latitude: number;
  longitude: number;
};

export function addPointBufferGraphic(input: {
  graphicsLayer: __esri.GraphicsLayer;
  point: BufferPoint;
  distance: number;
  unit: "kilometers" | "meters";
  spatialReference?: __esri.SpatialReference;
}) {
  const circle = new Circle({
    center: bufferCenterPoint(input.point, input.spatialReference),
    radius: input.distance,
    radiusUnit: input.unit,
    numberOfPoints: 64,
    spatialReference: input.spatialReference,
  });
  input.graphicsLayer.add(
    new Graphic({
      geometry: circle,
      symbol: new SimpleFillSymbol({
        color: [0, 0, 255, 0.2],
        outline: { color: [0, 0, 255], width: 2 },
      }),
      attributes: { id: input.point.id },
    })
  );
}
