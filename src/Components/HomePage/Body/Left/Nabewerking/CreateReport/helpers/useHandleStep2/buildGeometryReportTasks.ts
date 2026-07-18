import { processGeometry } from "./processGeometry";
import type { BuildReportTasksInput } from "./buildReportTasksInput";

export function buildGeometryReportTasks(input: BuildReportTasksInput) {
  return input.selectedGeometriesData.map((geometry, index) => () =>
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
}
