import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { AttachmentType } from "Types/finished_plans";

export function usePlanPointAttachments(
  planId: number | undefined,
  pointId: number | undefined,
  isFinished: boolean
) {
  return useQuery({
    queryKey: finishedPlanKeys.attachments(planId ?? 0, pointId ?? 0),
    queryFn: () =>
      fetchApi<AttachmentType[]>(
        `/finished_plans/getAttachmentsPlanSinglePoint?planId=${planId}&pointId=${pointId}`
      ),
    enabled:
      isFinished &&
      planId !== undefined &&
      planId > 0 &&
      pointId !== undefined &&
      pointId > 0,
  });
}
