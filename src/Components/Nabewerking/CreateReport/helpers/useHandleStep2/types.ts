import { FinishedPointType, FinishedGeometryType } from "Types/finished_plans";

export type AttachmentWithMeta = {
  name: string;
  blob: Blob;
  taken_at?: number;
};

export type ProcessedItem = {
  filename: string;
  pdfData: ArrayBuffer;
  attachments: AttachmentWithMeta[];
  pointName: string;
};

export type PreloadPointResult = {
  pointId: number;
  attachments: AttachmentWithMeta[];
};

export type PreloadGeometryResult = {
  geometryId: number;
  attachments: AttachmentWithMeta[];
};

type ReportProcessContext = {
  selectedPlan: any;
  activities: any;
  organizations: any;
  featureLayerUrl: string;
  tempLayer: __esri.GraphicsLayer;
  mapServerUrl: string;
  pilootOptions: { label: string; value: string }[];
  logoDataUrl: string | null;
  setZippingStatus: (status: string) => void;
};

export function pickReportProcessContext(input: ReportProcessContext) {
  return {
    selectedPlan: input.selectedPlan,
    activities: input.activities,
    organizations: input.organizations,
    featureLayerUrl: input.featureLayerUrl,
    mapServerUrl: input.mapServerUrl,
    pilootOptions: input.pilootOptions,
    logoDataUrl: input.logoDataUrl,
    setZippingStatus: input.setZippingStatus,
  };
}

export type ProcessPointParams = ReportProcessContext & {
  point: FinishedPointType;
  index: number;
  totalItems: number;
  attachmentsByPoint: Map<number, AttachmentWithMeta[]>;
};

export type ProcessGeometryParams = ReportProcessContext & {
  geometry: FinishedGeometryType;
  index: number;
  totalItems: number;
  pointsOffset: number;
  attachmentsByGeometry: Map<number, AttachmentWithMeta[]>;
};

