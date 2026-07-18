import Graphic from "@arcgis/core/Graphic";
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { closePolygonRing } from "@helpers/ArcGISHelpers/geometryPathFromPoints";
import { FinishedGeometryType } from "Types/finished_plans";
import { TIMESLIDER_RIGHT_HOVER_LABEL } from "./timesliderRightHoverLabel";

const HOVER_CYAN: [number, number, number, number] = [79, 241, 255, 0.95];

export function createSkyBluePolygonGraphic(
  path: number[][],
  geometryId: number
) {
  return new Graphic({
    geometry: new Polygon({
      rings: [closePolygonRing(path as [number, number][])],
      spatialReference: { wkid: 4326 },
    }),
    symbol: new SimpleFillSymbol({
      color: [79, 241, 255, 0.2],
      outline: { color: HOVER_CYAN, width: 3 },
      style: "solid",
    }),
    attributes: {
      label: TIMESLIDER_RIGHT_HOVER_LABEL,
      kind: "geometry",
      geometryId,
    },
  });
}

export function createSkyBluePolylineGraphic(
  path: number[][],
  geometryId: number
) {
  return new Graphic({
    geometry: new Polyline({
      paths: [path],
      spatialReference: { wkid: 4326 },
    }),
    symbol: new SimpleLineSymbol({
      color: HOVER_CYAN,
      width: 3,
      style: "solid",
    }),
    attributes: {
      label: TIMESLIDER_RIGHT_HOVER_LABEL,
      kind: "geometry",
      geometryId,
    },
  });
}

export function drawGeometryHoverSkyBlue(input: {
  layer: __esri.GraphicsLayer;
  geometry: FinishedGeometryType;
  path: number[][];
  isPolygon: boolean;
}) {
  const { layer, geometry, path, isPolygon } = input;
  if (isPolygon && path.length >= 3) {
    layer.add(createSkyBluePolygonGraphic(path, geometry.id));
    return;
  }
  layer.add(createSkyBluePolylineGraphic(path, geometry.id));
}
