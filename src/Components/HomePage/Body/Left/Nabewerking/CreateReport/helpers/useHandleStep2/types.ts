import { FinishedPointType, FinishedGeometryType } from "Types/finished_plans";

export type ProcessedItem = {
  filename: string;
  pdfData: ArrayBuffer;
  attachments: { name: string; blob: Blob }[];
  pointName: string;
};

export type PreloadPointResult = {
  pointId: number;
  attachments: { name: string; blob: Blob }[];
};

export type PreloadGeometryResult = {
  geometryId: number;
  attachments: { name: string; blob: Blob }[];
};

export type ProcessPointParams = {
  point: FinishedPointType;
  index: number;
  totalItems: number;
  selectedPlan: any;
  activities: any;
  organizations: any;
  attachmentsByPoint: Map<number, { name: string; blob: Blob }[]>;
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
  attachmentsByGeometry: Map<number, { name: string; blob: Blob }[]>;
  featureLayerUrl: string;
  tempLayer: __esri.GraphicsLayer;
  mapServerUrl: string;
  pilootOptions: { label: string; value: string }[];
  logoDataUrl: string | null;
  setZippingStatus: (status: string) => void;
};

