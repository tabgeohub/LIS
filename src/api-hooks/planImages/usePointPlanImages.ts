import { useEntityPlanImages } from "./useEntityPlanImages";

export function usePointPlanImages(input: {
  pointId: number;
  planIds: number[];
  regioId: string | undefined;
  enabled: boolean;
}) {
  return useEntityPlanImages({
    endpoint: "/api/timeslider/pointPlanImages",
    entityParamKey: "point_id",
    entityId: input.pointId,
    planIds: input.planIds,
    regioId: input.regioId,
    enabled: input.enabled,
  });
}
