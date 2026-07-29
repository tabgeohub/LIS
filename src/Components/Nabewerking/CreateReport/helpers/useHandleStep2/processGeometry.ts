import { calculateGeometryCentroid } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { BaseGeometryData } from "@helpers/ArcGISHelpers/createGeometryGraphic";
import {
  pickReportProcessContext,
  ProcessGeometryParams,
  ProcessedItem,
} from "./types";
import { addGeometryReportGraphic } from "./addGeometryReportGraphic";
import { runReportGenerationPipeline } from "./reportGenerationPipeline";

export function resolveGeometryReportContext(
  geometry: ProcessGeometryParams["geometry"]
) {
  const firstPoint = geometry.points?.[0];
  if (!firstPoint) throw new Error("Geometry has no points");

  const centroid = calculateGeometryCentroid(geometry as BaseGeometryData);
  if (!centroid) throw new Error("Could not calculate geometry centroid");

  const description =
    geometry.geometry_omschrijving || `Geometrie ${geometry.id}`;

  return { firstPoint, centroid, description };
}

export async function processGeometry(
  params: ProcessGeometryParams
): Promise<ProcessedItem> {
  const {
    geometry,
    index,
    totalItems,
    pointsOffset,
    attachmentsByGeometry,
    tempLayer,
  } = params;

  const { firstPoint, centroid, description } =
    resolveGeometryReportContext(geometry);
  const currentIndex = pointsOffset + index + 1;

  return runReportGenerationPipeline({
    ...pickReportProcessContext(params),
    statusMessage: `Rapport ${currentIndex} van ${totalItems} wordt gegenereerd: '${description}'`,
    filenamePrefix: "Geometry",
    renderOnMap: () => addGeometryReportGraphic(tempLayer, geometry),
    point: firstPoint,
    omschrijving: description,
    aanvullende: geometry.id,
    longitude: centroid.longitude,
    latitude: centroid.latitude,
    cachedAttachments: attachmentsByGeometry.get(geometry.id),
  });
}
