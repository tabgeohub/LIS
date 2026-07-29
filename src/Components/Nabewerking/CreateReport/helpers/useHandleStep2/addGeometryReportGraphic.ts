import {
  BaseGeometryData,
  createGeometryGraphic,
  GEOMETRY_REPORT_SYMBOL,
} from "@helpers/ArcGISHelpers/createGeometryGraphic";
import type { FinishedGeometryType } from "Types/finished_plans";

export function addGeometryReportGraphic(
  tempLayer: __esri.GraphicsLayer,
  geometry: FinishedGeometryType
) {
  const geometryGraphic = createGeometryGraphic(geometry as BaseGeometryData, {
    symbolOptions: GEOMETRY_REPORT_SYMBOL,
  });
  if (geometryGraphic) {
    tempLayer.removeAll();
    tempLayer.add(geometryGraphic);
  }
}
