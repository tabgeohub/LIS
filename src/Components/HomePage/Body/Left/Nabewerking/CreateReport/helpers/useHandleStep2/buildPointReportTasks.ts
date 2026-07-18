import { processPoint } from "./processPoint";
import type { BuildReportTasksInput } from "./buildReportTasksInput";
import { pickSharedReportTaskContext } from "./pickSharedReportTaskContext";

export function buildPointReportTasks(input: BuildReportTasksInput) {
  const shared = pickSharedReportTaskContext(input);
  return input.selectedPointsData.map((point, index) => () =>
    processPoint({
      point,
      index,
      totalItems: input.totalItems,
      attachmentsByPoint: input.attachmentsByPoint,
      ...shared,
    })
  );
}
