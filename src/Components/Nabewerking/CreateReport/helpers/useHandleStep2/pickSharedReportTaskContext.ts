import type { BuildReportTasksInput } from "./buildReportTasksInput";

/** Shared fields passed to both processPoint and processGeometry report tasks. */
export function pickSharedReportTaskContext(input: BuildReportTasksInput) {
  return {
    selectedPlan: input.selectedPlan,
    activities: input.activities,
    organizations: input.organizations,
    featureLayerUrl: input.featureLayerUrl,
    tempLayer: input.tempLayer,
    mapServerUrl: input.mapServerUrl,
    pilootOptions: input.pilootOptions,
    logoDataUrl: input.logoDataUrl,
    setZippingStatus: input.setZippingStatus,
  };
}
