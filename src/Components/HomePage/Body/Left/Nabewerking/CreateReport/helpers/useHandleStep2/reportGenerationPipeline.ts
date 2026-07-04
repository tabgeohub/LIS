import { generatePdfReport } from "../generatePdfReport";
import { FinishedFlightPlanType, FinishedPointType } from "Types/finished_plans";
import type { AttachmentWithMeta, ProcessedItem } from "./types";
import {
  buildPdfPointData,
  fetchOverviewDetailImages,
  resolveReportAttachments,
  toSafeReportName,
} from "./reportPdfCommon";

export type ReportGenerationPipelineInput = {
  setZippingStatus: (status: string) => void;
  statusMessage: string;
  filenamePrefix: "Point" | "Geometry";
  renderOnMap: () => void;
  selectedPlan: FinishedFlightPlanType;
  point: FinishedPointType;
  activities: Array<{ label: string; value: string | number }>;
  organizations: Array<{ label: string; value: string | number }>;
  omschrijving: string;
  aanvullende: string | number;
  longitude: number;
  latitude: number;
  cachedAttachments: AttachmentWithMeta[] | undefined;
  featureLayerUrl: string;
  mapServerUrl: string;
  pilootOptions: { label: string; value: string }[];
  logoDataUrl: string | null;
};

export async function runReportGenerationPipeline(
  input: ReportGenerationPipelineInput
): Promise<ProcessedItem> {
  input.setZippingStatus(input.statusMessage);
  input.renderOnMap();

  const [overviewImage, detailImage] = await fetchOverviewDetailImages({
    longitude: input.longitude,
    latitude: input.latitude,
    mapServerUrl: input.mapServerUrl,
  });

  const pointData = buildPdfPointData({
    selectedPlan: input.selectedPlan,
    point: input.point,
    activities: input.activities,
    organizations: input.organizations,
    omschrijving: input.omschrijving,
    aanvullende: input.aanvullende,
    longitude: input.longitude,
    latitude: input.latitude,
  });

  const safeName = toSafeReportName(pointData.omschrijving);
  const attachments = await resolveReportAttachments({
    cached: input.cachedAttachments,
    featureLayerUrl: input.featureLayerUrl,
    point: input.point,
  });

  const pdfData = await generatePdfReport({
    pointData,
    overviewImage,
    detailImage,
    pilootOptions: input.pilootOptions,
    attachments,
    preloadedLogoDataUrl: input.logoDataUrl || undefined,
  });

  return {
    filename: `Waarnemingsrapport_${input.filenamePrefix}_${safeName}.pdf`,
    pdfData: await pdfData.arrayBuffer(),
    attachments,
    pointName: safeName,
  };
}
