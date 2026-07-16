import { useEntityPlanImages } from "./useEntityPlanImages";

export function useGeometryPlanImages(input: {
  geometryId: number;
  planIds: number[];
  regioId: string | undefined;
  enabled: boolean;
}) {
  return useEntityPlanImages({
    endpoint: "/api/timeslider/geometryPlanImages",
    entityParamKey: "geometry_id",
    entityId: input.geometryId,
    planIds: input.planIds,
    regioId: input.regioId,
    enabled: input.enabled,
  });
}
