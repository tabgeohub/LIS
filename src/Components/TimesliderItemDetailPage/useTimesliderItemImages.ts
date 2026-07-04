import { useMemo } from "react";
import { usePointPlanImages } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/usePointPlanImages";
import { useGeometryPlanImages } from "Components/HomePage/Body/Right/SelectedPlansPointsList/Common/useGeometryPlanImages";
import { FinishedFlightPlanType } from "Types/finished_plans";

export function useTimesliderItemImages(input: {
  ok: boolean;
  kind: "point" | "geometry";
  itemId: number;
  planIds: number[];
  regioId: string | undefined;
  selectedPlan: FinishedFlightPlanType | null;
}) {
  const pointResult = usePointPlanImages({
    pointId: input.itemId,
    planIds: input.planIds,
    regioId: input.regioId,
    enabled:
      input.ok &&
      input.kind === "point" &&
      !!input.regioId &&
      input.planIds.length > 0,
  });

  const geometryResult = useGeometryPlanImages({
    geometryId: input.itemId,
    planIds: input.planIds,
    regioId: input.regioId,
    enabled:
      input.ok &&
      input.kind === "geometry" &&
      !!input.regioId &&
      input.planIds.length > 0,
  });

  const rowsForSelectedPlan = useMemo(() => {
    if (!input.selectedPlan) return [];
    const imageRows =
      input.kind === "point" ? pointResult.images : geometryResult.images;
    return imageRows.filter((row) => row.plan_id === input.selectedPlan!.id);
  }, [input.selectedPlan, input.kind, pointResult.images, geometryResult.images]);

  return { pointResult, geometryResult, rowsForSelectedPlan };
}
