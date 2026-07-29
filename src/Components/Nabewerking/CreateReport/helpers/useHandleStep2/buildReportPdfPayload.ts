import {
  buildPdfPointData,
  fetchOverviewDetailImages,
  resolveReportAttachments,
  toSafeReportName,
} from "./reportPdfCommon";
import type { ReportGenerationPipelineInput } from "./reportGenerationPipelineTypes";
import { finalizeReportPdfItem } from "./finalizeReportPdfItem";

export async function buildReportPdfPayload(
  input: ReportGenerationPipelineInput
) {
  const [overviewImage, detailImage] = await fetchOverviewDetailImages(input);
  const pointData = buildPdfPointData(input);
  const attachments = await resolveReportAttachments({
    cached: input.cachedAttachments,
    featureLayerUrl: input.featureLayerUrl,
    point: input.point,
  });
  return finalizeReportPdfItem({
    ...input,
    safeName: toSafeReportName(pointData.omschrijving),
    pointData,
    overviewImage,
    detailImage,
    attachments,
  });
}
