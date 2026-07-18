import { FinishedFlightPlanType } from "Types/finished_plans";

export type GenerateReportZipInput = {
  map: __esri.Map;
  selectedPlan: FinishedFlightPlanType;
  selectedPoints: number[];
  selectedGeometries: number[];
  activities: Array<{ label: string; value: string | number }>;
  organizations: Array<{ label: string; value: string | number }>;
  mapServerUrl: string;
  pilootOptions: { label: string; value: string }[];
  setZipFile: (zipFile: Blob) => void;
  setZippingStatus: (status: string) => void;
};
