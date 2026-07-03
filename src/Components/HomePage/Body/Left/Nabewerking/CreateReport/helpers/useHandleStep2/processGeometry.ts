import {
  BaseGeometryData,
  createGeometryGraphic,
  GEOMETRY_REPORT_SYMBOL,
} from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { calculateGeometryCentroid } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { generatePdfReport } from "../generatePdfReport";
import { FinishedPointType } from "Types/finished_plans";
import { ProcessGeometryParams, ProcessedItem } from "./types";
import {
  buildPdfPointData,
  fetchOverviewDetailImages,
  resolveReportAttachments,
  toSafeReportName,
} from "./reportPdfCommon";

export async function processGeometry(
  params: ProcessGeometryParams
): Promise<ProcessedItem> {
  const {
    geometry,
    index,
    totalItems,
    pointsOffset,
    selectedPlan,
    activities,
    organizations,
    attachmentsByGeometry,
    featureLayerUrl,
    tempLayer,
    mapServerUrl,
    pilootOptions,
    logoDataUrl,
    setZippingStatus,
  } = params;

  const currentIndex = pointsOffset + index + 1;
  setZippingStatus(
    `Rapport ${currentIndex} van ${totalItems} wordt gegenereerd: '${
      geometry.geometry_omschrijving || `Geometrie ${geometry.id}`
    }'`
  );

  const firstPoint = geometry.points?.[0];
  if (!firstPoint) throw new Error("Geometry has no points");

  const centroid = calculateGeometryCentroid(geometry as BaseGeometryData);
  if (!centroid) throw new Error("Could not calculate geometry centroid");

  const geometryGraphic = createGeometryGraphic(geometry as BaseGeometryData, {
    symbolOptions: GEOMETRY_REPORT_SYMBOL,
  });
  if (geometryGraphic) {
    tempLayer.removeAll();
    tempLayer.add(geometryGraphic);
  }

  const [overviewImage, detailImage] = await fetchOverviewDetailImages({
    longitude: centroid.longitude,
    latitude: centroid.latitude,
    mapServerUrl,
  });

  const geometryData = buildPdfPointData({
    selectedPlan,
    point: firstPoint,
    activities,
    organizations,
    omschrijving: geometry.geometry_omschrijving || `Geometrie ${geometry.id}`,
    aanvullende: geometry.id,
    longitude: centroid.longitude,
    latitude: centroid.latitude,
  });

  const safeName = toSafeReportName(geometryData.omschrijving);
  const attachments = await resolveReportAttachments({
    cached: attachmentsByGeometry.get(geometry.id),
    featureLayerUrl,
    point: firstPoint as FinishedPointType,
  });

  const pdfData = await generatePdfReport({
    pointData: geometryData,
    overviewImage,
    detailImage,
    pilootOptions,
    attachments,
    preloadedLogoDataUrl: logoDataUrl || undefined,
  });

  return {
    filename: `Waarnemingsrapport_Geometry_${safeName}.pdf`,
    pdfData: await pdfData.arrayBuffer(),
    attachments,
    pointName: safeName,
  };
}
