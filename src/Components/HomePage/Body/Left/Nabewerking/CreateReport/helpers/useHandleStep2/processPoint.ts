import { ProcessPointParams, ProcessedItem } from "./types";
import { addPointReportGraphic } from "./addPointReportGraphic";
import { runReportGenerationPipeline } from "./reportGenerationPipeline";

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

  return runReportGenerationPipeline({
    setZippingStatus,
    statusMessage: `Rapport ${index + 1} van ${totalItems} wordt gegenereerd: '${point.omschrijving}'`,
    filenamePrefix: "Point",
    renderOnMap: () => addPointReportGraphic(tempLayer, point),
    selectedPlan,
    point,
    activities,
    organizations,
    omschrijving: point.omschrijving,
    aanvullende: point.id,
    longitude: point.longitude,
    latitude: point.latitude,
    cachedAttachments: attachmentsByPoint.get(point.id),
    featureLayerUrl,
    mapServerUrl,
    pilootOptions,
    logoDataUrl,
  });
}
