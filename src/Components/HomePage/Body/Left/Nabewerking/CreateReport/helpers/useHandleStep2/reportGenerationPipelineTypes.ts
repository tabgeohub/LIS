import type { AttachmentWithMeta } from "./types";
import { FinishedFlightPlanType, FinishedPointType } from "Types/finished_plans";

export type ReportPdfPointContext = {
  selectedPlan: FinishedFlightPlanType;
  point: FinishedPointType;
  activities: Array<{ label: string; value: string | number }>;
  organizations: Array<{ label: string; value: string | number }>;
  omschrijving: string;
  aanvullende: string | number;
  longitude: number;
  latitude: number;
};

export type ReportGenerationPipelineInput = ReportPdfPointContext & {
  setZippingStatus: (status: string) => void;
  statusMessage: string;
  filenamePrefix: "Point" | "Geometry";
  renderOnMap: () => void;
  cachedAttachments: AttachmentWithMeta[] | undefined;
  featureLayerUrl: string;
  mapServerUrl: string;
  pilootOptions: { label: string; value: string }[];
  logoDataUrl: string | null;
};
