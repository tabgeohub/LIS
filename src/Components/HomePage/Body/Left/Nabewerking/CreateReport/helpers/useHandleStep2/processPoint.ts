import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Graphic from "@arcgis/core/Graphic";
import { generatePdfReport } from "../generatePdfReport";
import { ProcessPointParams, ProcessedItem } from "./types";
import {
  buildPdfPointData,
  fetchOverviewDetailImages,
  resolveReportAttachments,
  toSafeReportName,
} from "./reportPdfCommon";

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
    `Rapport ${index + 1} van ${totalItems} wordt gegenereerd: '${point.omschrijving}'`
  );

  const graphic = new Graphic({
    geometry: new Point({
      latitude: point.latitude,
      longitude: point.longitude,
    }),
    symbol: new SimpleMarkerSymbol({
      color: [255, 140, 0, 1],
      size: 10,
      outline: { color: [0, 0, 0, 1], width: 1 },
    }),
  });
  tempLayer.removeAll();
  tempLayer.add(graphic);

  const [overviewImage, detailImage] = await fetchOverviewDetailImages({
    longitude: point.longitude,
    latitude: point.latitude,
    mapServerUrl,
  });

  const pointData = buildPdfPointData({
    selectedPlan,
    point,
    activities,
    organizations,
    omschrijving: point.omschrijving,
    aanvullende: point.id,
    longitude: point.longitude,
    latitude: point.latitude,
  });

  const safeName = toSafeReportName(pointData.omschrijving);
  const attachments = await resolveReportAttachments({
    cached: attachmentsByPoint.get(point.id),
    featureLayerUrl,
    point,
  });

  const pdfData = await generatePdfReport({
    pointData,
    overviewImage,
    detailImage,
    pilootOptions,
    attachments,
    preloadedLogoDataUrl: logoDataUrl || undefined,
  });

  return {
    filename: `Waarnemingsrapport_Point_${safeName}.pdf`,
    pdfData: await pdfData.arrayBuffer(),
    attachments,
    pointName: safeName,
  };
}
