import {
  BaseGeometryData,
  createGeometryGraphic,
  GEOMETRY_REPORT_SYMBOL,
} from "@helpers/ArcGISHelpers/createGeometryGraphic";
import { calculateGeometryCentroid } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { generatePdfReport } from "../generatePdfReport";
import { PDFPointDataType } from "Types";
import { FinishedGeometryType, FinishedPointType } from "Types/finished_plans";
import { getStaticMapImage } from "./mapImage";
import { safeFetchPointAttachments } from "./attachments";
import { ProcessGeometryParams, ProcessedItem } from "./types";

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

  // Get first point for data (attachments, comment, etc.)
  const firstPoint = geometry.points?.[0];
  if (!firstPoint) {
    throw new Error("Geometry has no points");
  }

  // Calculate centroid for map image centering
  const centroid = calculateGeometryCentroid(geometry as BaseGeometryData);
  if (!centroid) {
    throw new Error("Could not calculate geometry centroid");
  }

  const geometryGraphic = createGeometryGraphic(geometry as BaseGeometryData, {
    symbolOptions: GEOMETRY_REPORT_SYMBOL,
  });

  if (geometryGraphic) {
    tempLayer.removeAll();
    tempLayer.add(geometryGraphic);
  }

  // Parallelize map image fetching centered on centroid
  const [overviewImage, detailImage] = await Promise.all([
    getStaticMapImage(
      centroid.longitude,
      centroid.latitude,
      10,
      1600,
      900,
      mapServerUrl
    ),
    getStaticMapImage(
      centroid.longitude,
      centroid.latitude,
      17,
      1600,
      900,
      mapServerUrl
    ),
  ]);

  // Use first point's data for the report
  const geometryData: PDFPointDataType = {
    datum: selectedPlan.datum,
    piloot: selectedPlan.piloot,
    waarnemer: selectedPlan.waarnemer,
    luchtvaartuig: selectedPlan.luchtvaartuig,
    hoofdthema: selectedPlan.hoofdthema,
    organisatie:
      organizations.find((org: any) => org.value === firstPoint.organisatie_id)
        ?.label || "",
    activiteit:
      activities.find((act: any) => act.value === firstPoint.activiteit_id)
        ?.label || "",
    regio: firstPoint.regio_id,
    omschrijving: geometry.geometry_omschrijving || `Geometrie ${geometry.id}`,
    aanvullende: geometry.id,
    rdX: firstPoint.xcoordinaat_rd,
    rdY: firstPoint.ycoordinaat_rd,
    long: centroid.longitude,
    lat: centroid.latitude,
  };

  const safeName = geometryData.omschrijving
    .replace(/[^\w\s\-]/g, "_")
    .replace(/\s+/g, "_");

  // Get attachments from preloaded data or fetch if needed
  let attachments = attachmentsByGeometry.get(geometry.id) || [];
  if (
    (!attachments || attachments.length === 0) &&
    firstPoint.attachments &&
    firstPoint.attachments.length > 0
  ) {
    try {
      attachments = await safeFetchPointAttachments(
        featureLayerUrl,
        firstPoint as FinishedPointType
      );
    } catch {
      attachments = [];
    }
  }

  const pdfData = await generatePdfReport(
    geometryData,
    overviewImage,
    detailImage,
    pilootOptions,
    attachments,
    logoDataUrl || undefined
  );
  const arrayBuffer = await pdfData.arrayBuffer();

  return {
    filename: `Waarnemingsrapport_Geometry_${safeName}.pdf`,
    pdfData: arrayBuffer,
    attachments,
    pointName: safeName,
  };
}
