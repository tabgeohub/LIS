import type { FinishedFlightPlanType } from "Types/finished_plans";
import { processGeometry } from "./processGeometry";
import { processPoint } from "./processPoint";
import type { ProcessGeometryParams, ProcessPointParams } from "./types";

type BuildReportTasksInput = {
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

export function buildReportProcessingTasks(input: BuildReportTasksInput) {
  const pointTasks = input.selectedPointsData.map((point, index) => () =>
    processPoint({
      point,
      index,
      totalItems: input.totalItems,
      selectedPlan: input.selectedPlan,
      activities: input.activities,
      organizations: input.organizations,
      attachmentsByPoint: input.attachmentsByPoint,
      featureLayerUrl: input.featureLayerUrl,
      tempLayer: input.tempLayer,
      mapServerUrl: input.mapServerUrl,
      pilootOptions: input.pilootOptions,
      logoDataUrl: input.logoDataUrl,
      setZippingStatus: input.setZippingStatus,
    })
  );

  const geometryTasks = input.selectedGeometriesData.map((geometry, index) => () =>
    processGeometry({
      geometry,
      index,
      totalItems: input.totalItems,
      pointsOffset: input.selectedPointsData.length,
      selectedPlan: input.selectedPlan,
      activities: input.activities,
      organizations: input.organizations,
      attachmentsByGeometry: input.attachmentsByGeometry,
      featureLayerUrl: input.featureLayerUrl,
      tempLayer: input.tempLayer,
      mapServerUrl: input.mapServerUrl,
      pilootOptions: input.pilootOptions,
      logoDataUrl: input.logoDataUrl,
      setZippingStatus: input.setZippingStatus,
    })
  );

  return [...pointTasks, ...geometryTasks];
}
