import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { AttachmentType } from "Types/finished_plans";

export function usePlanPointAttachments(input: {
  planId: number | undefined;
  pointId: number | undefined;
  isFinished: boolean;
}) {
  const planId = input.planId ?? 0;
  const pointId = input.pointId ?? 0;
  const enabled =
    input.isFinished && planId > 0 && pointId > 0;

  return useQuery({
    queryKey: finishedPlanKeys.attachments(planId, pointId),
    queryFn: () =>
      fetchApi<AttachmentType[]>(
        `/finished_plans/getAttachmentsPlanSinglePoint?planId=${input.planId}&pointId=${input.pointId}`
      ),
    enabled,
  });
}
