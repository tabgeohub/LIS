import type { ProcessGeometryParams, ProcessPointParams } from "./types";
import type { FinishedFlightPlanType } from "Types/finished_plans";

export type BuildReportTasksInput = {
  selectedPlan: FinishedFlightPlanType;
  selectedPointsData: FinishedFlightPlanType["points_data"];
  selectedGeometriesData: NonNullable<FinishedFlightPlanType["geometries"]>;
  totalItems: number;
  activities: ProcessPointParams["activities"];
  organizations: ProcessPointParams["organizations"];
  attachmentsByPoint: ProcessPointParams["attachmentsByPoint"];
  attachmentsByGeometry: ProcessGeometryParams["attachmentsByGeometry"];
  featureLayerUrl: string;
  tempLayer: __esri.GraphicsLayer;
  mapServerUrl: string;
  pilootOptions: ProcessPointParams["pilootOptions"];
  logoDataUrl: string | null;
  setZippingStatus: ProcessPointParams["setZippingStatus"];
};
