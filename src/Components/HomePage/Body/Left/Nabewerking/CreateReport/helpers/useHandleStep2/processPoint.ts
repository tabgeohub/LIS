import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Graphic from "@arcgis/core/Graphic";
import { generatePdfReport } from "../generatePdfReport";
import { PDFPointDataType } from "Types";
import { FinishedPointType, FinishedFlightPlanType } from "Types/finished_plans";
import { getStaticMapImage } from "./mapImage";
import { safeFetchPointAttachments } from "./attachments";
import { ProcessPointParams, ProcessedItem } from "./types";

export async function processPoint(
  params: ProcessPointParams
): Promise<ProcessedItem> {
  const {
    point,
    index,
    totalItems,
    selectedPlan,
    activities,
    organizations,
    attachmentsByPoint,
    featureLayerUrl,
    tempLayer,
    mapServerUrl,
    pilootOptions,
    logoDataUrl,
    setZippingStatus,
  } = params;

  setZippingStatus(
    `Rapport ${index + 1} van ${totalItems} wordt gegenereerd: '${
      point.omschrijving
    }'`
  );

  const geometry = new Point({
    latitude: point.latitude,
    longitude: point.longitude,
  });

  const symbol = new SimpleMarkerSymbol({
    color: [255, 140, 0, 1],
    size: 10,
    outline: { color: [0, 0, 0, 1], width: 1 },
  });

  const graphic = new Graphic({ geometry, symbol });
  tempLayer.removeAll();
  tempLayer.add(graphic);

  // Parallelize map image fetching
  const [overviewImage, detailImage] = await Promise.all([
    getStaticMapImage(
      point.longitude,
      point.latitude,
      10,
      1600,
      900,
      mapServerUrl
    ),
    getStaticMapImage(
      point.longitude,
      point.latitude,
      17,
      1600,
      900,
      mapServerUrl
    ),
  ]);

  const pointData: PDFPointDataType = {
    datum: selectedPlan.datum,
    piloot: selectedPlan.piloot,
    waarnemer: selectedPlan.waarnemer,
    luchtvaartuig: selectedPlan.luchtvaartuig,
    hoofdthema: selectedPlan.hoofdthema,
    organisatie:
      organizations.find((org: any) => org.value === point.organisatie_id)
        ?.label || "",
    activiteit:
      activities.find((act: any) => act.value === point.activiteit_id)
        ?.label || "",
    regio: point.regio_id,
    omschrijving: point.omschrijving,
    aanvullende: point.id,
    rdX: point.xcoordinaat_rd,
    rdY: point.ycoordinaat_rd,
    long: point.longitude,
    lat: point.latitude,
  };

  const safeName = pointData.omschrijving
    .replace(/[^\w\s\-]/g, "_")
    .replace(/\s+/g, "_");

  let attachments = attachmentsByPoint.get(point.id) || [];
  if (
    (!attachments || attachments.length === 0) &&
    Array.isArray(point.attachments) &&
    point.attachments.length > 0
  ) {
    try {
      attachments = await safeFetchPointAttachments(
        featureLayerUrl,
        point as FinishedPointType
      );
    } catch {
      attachments = [];
    }
  }

  const pdfData = await generatePdfReport(
    pointData,
    overviewImage,
    detailImage,
    pilootOptions,
    attachments,
    logoDataUrl || undefined
  );
  const arrayBuffer = await pdfData.arrayBuffer();

  return {
    filename: `Waarnemingsrapport_Point_${safeName}.pdf`,
    pdfData: arrayBuffer,
    attachments,
    pointName: safeName,
  };
}

