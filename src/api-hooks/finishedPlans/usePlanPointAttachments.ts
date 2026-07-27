import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { AttachmentType } from "Types/finished_plans";

type PlanPointAttachmentsInput = {
  planId: number | undefined;
  pointId: number | undefined;
  isFinished: boolean;
};

function resolveAttachmentId(id: number | undefined): number {
  return id ?? 0;
}

function isAttachmentsQueryEnabled(
  isFinished: boolean,
  planId: number,
  pointId: number
): boolean {
  if (!isFinished) return false;
  if (planId <= 0) return false;
  return pointId > 0;
}

function fetchPlanPointAttachments(
  planId: number | undefined,
  pointId: number | undefined
) {
  return fetchApi<AttachmentType[]>(
    `/finished_plans/getAttachmentsPlanSinglePoint?planId=${planId}&pointId=${pointId}`
  );
}

export function usePlanPointAttachments(input: PlanPointAttachmentsInput) {
  const planId = resolveAttachmentId(input.planId);
  const pointId = resolveAttachmentId(input.pointId);

  return useQuery({
    queryKey: finishedPlanKeys.attachments(planId, pointId),
    queryFn: () => fetchPlanPointAttachments(input.planId, input.pointId),
    enabled: isAttachmentsQueryEnabled(input.isFinished, planId, pointId),
  });
}
