import {
  pickReportProcessContext,
  ProcessPointParams,
  ProcessedItem,
} from "./types";
import { addPointReportGraphic } from "./addPointReportGraphic";
import { runReportGenerationPipeline } from "./reportGenerationPipeline";

export async function processPoint(
  params: ProcessPointParams
): Promise<ProcessedItem> {
  const {
    point,
    index,
    totalItems,
    attachmentsByPoint,
    tempLayer,
  } = params;

  return runReportGenerationPipeline({
    ...pickReportProcessContext(params),
    statusMessage: `Rapport ${index + 1} van ${totalItems} wordt gegenereerd: '${point.omschrijving}'`,
    filenamePrefix: "Point",
    renderOnMap: () => addPointReportGraphic(tempLayer, point),
    point,
    omschrijving: point.omschrijving,
    aanvullende: point.id,
    longitude: point.longitude,
    latitude: point.latitude,
    cachedAttachments: attachmentsByPoint.get(point.id),
  });
}
