import { processPoint } from "./processPoint";
import type { BuildReportTasksInput } from "./buildReportTasksInput";

export function buildPointReportTasks(input: BuildReportTasksInput) {
  return input.selectedPointsData.map((point, index) => () =>
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
}
