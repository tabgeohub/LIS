import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "api/fetchApi";
import { finishedPlanKeys } from "lib/queryKeys";
import { AttachmentType } from "Types/finished_plans";

function coalesceZero(value: number | undefined): number {
  return value ?? 0;
}

function isPositiveId(value: number | undefined): boolean {
  return value !== undefined && value > 0;
}

function attachmentsQueryEnabled(input: {
  planId: number | undefined;
  pointId: number | undefined;
  isFinished: boolean;
}): boolean {
  return (
    input.isFinished &&
    isPositiveId(input.planId) &&
    isPositiveId(input.pointId)
  );
}

export function usePlanPointAttachments(input: {
  planId: number | undefined;
  pointId: number | undefined;
  isFinished: boolean;
}) {
  return useQuery({
    queryKey: finishedPlanKeys.attachments(
      coalesceZero(input.planId),
      coalesceZero(input.pointId)
    ),
    queryFn: () =>
      fetchApi<AttachmentType[]>(
        `/finished_plans/getAttachmentsPlanSinglePoint?planId=${input.planId}&pointId=${input.pointId}`
      ),
    enabled: attachmentsQueryEnabled(input),
  });
}
