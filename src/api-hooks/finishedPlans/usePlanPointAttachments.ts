import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { AttachmentType } from "Types/finished_plans";

export function usePlanPointAttachments(input: {
  planId: number | undefined;
  pointId: number | undefined;
  isFinished: boolean;
}) {
  return useQuery({
    queryKey: finishedPlanKeys.attachments(input.planId ?? 0, input.pointId ?? 0),
    queryFn: () => fetchApi<AttachmentType[]>(`/finished_plans/getAttachmentsPlanSinglePoint?planId=${input.planId}&pointId=${input.pointId}`),
    enabled: input.isFinished && input.planId !== undefined && input.planId > 0 && input.pointId !== undefined && input.pointId > 0,
  });
}
