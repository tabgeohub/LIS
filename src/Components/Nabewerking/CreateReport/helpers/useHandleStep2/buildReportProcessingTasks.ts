import { buildGeometryReportTasks } from "./buildGeometryReportTasks";
import { buildPointReportTasks } from "./buildPointReportTasks";
import type { BuildReportTasksInput } from "./buildReportTasksInput";

export function buildReportProcessingTasks(input: BuildReportTasksInput) {
  return [
    ...buildPointReportTasks(input),
    ...buildGeometryReportTasks(input),
  ];
}
