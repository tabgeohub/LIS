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

export type ProcessPointParams = {
  point: FinishedPointType;
  index: number;
  totalItems: number;
  selectedPlan: any;
  activities: any;
  organizations: any;
  attachmentsByPoint: Map<number, AttachmentWithMeta[]>;
  featureLayerUrl: string;
  tempLayer: __esri.GraphicsLayer;
  mapServerUrl: string;
  pilootOptions: { label: string; value: string }[];
  logoDataUrl: string | null;
  setZippingStatus: (status: string) => void;
};

export type ProcessGeometryParams = {
  geometry: FinishedGeometryType;
  index: number;
  totalItems: number;
  pointsOffset: number;
  selectedPlan: any;
  activities: any;
  organizations: any;
  attachmentsByGeometry: Map<number, AttachmentWithMeta[]>;
  featureLayerUrl: string;
  tempLayer: __esri.GraphicsLayer;
  mapServerUrl: string;
  pilootOptions: { label: string; value: string }[];
  logoDataUrl: string | null;
  setZippingStatus: (status: string) => void;
};

