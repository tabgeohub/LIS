import { processGeometry } from "./processGeometry";
import type { BuildReportTasksInput } from "./buildReportTasksInput";
import { pickSharedReportTaskContext } from "./pickSharedReportTaskContext";

export function buildGeometryReportTasks(input: BuildReportTasksInput) {
  const shared = pickSharedReportTaskContext(input);
  return input.selectedGeometriesData.map((geometry, index) => () =>
    processGeometry({
      geometry,
      index,
      totalItems: input.totalItems,
      pointsOffset: input.selectedPointsData.length,
      attachmentsByGeometry: input.attachmentsByGeometry,
      ...shared,
    })
  );
}
