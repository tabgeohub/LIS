import { buildReportPdfPayload } from "./buildReportPdfPayload";
import type { ProcessedItem } from "./types";
import type { ReportGenerationPipelineInput } from "./reportGenerationPipelineTypes";

export type { ReportGenerationPipelineInput } from "./reportGenerationPipelineTypes";

export async function runReportGenerationPipeline(
  input: ReportGenerationPipelineInput
): Promise<ProcessedItem> {
  input.setZippingStatus(input.statusMessage);
  input.renderOnMap();
  return buildReportPdfPayload(input);
}
