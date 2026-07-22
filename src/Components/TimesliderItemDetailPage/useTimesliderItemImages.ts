import { useMemo } from "react";
import {
  useGeometryPlanImages,
  usePointPlanImages,
} from "api-hooks/planImages";
import { FinishedFlightPlanType } from "Types/finished_plans";

function imagesEnabled(options: {
  ok: boolean;
  regioId: string | undefined;
  planIds: number[];
  kind: "point" | "geometry";
  actualKind: "point" | "geometry";
}): boolean {
  return (
    options.ok &&
    options.actualKind === options.kind &&
    !!options.regioId &&
    options.planIds.length > 0
  );
}

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
    enabled: imagesEnabled({
      ok: input.ok,
      regioId: input.regioId,
      planIds: input.planIds,
      kind: "point",
      actualKind: input.kind,
    }),
  });

  const geometryResult = useGeometryPlanImages({
    geometryId: input.itemId,
    planIds: input.planIds,
    regioId: input.regioId,
    enabled: imagesEnabled({
      ok: input.ok,
      regioId: input.regioId,
      planIds: input.planIds,
      kind: "geometry",
      actualKind: input.kind,
    }),
  });

  const rowsForSelectedPlan = useMemo(() => {
    if (!input.selectedPlan) return [];
    const imageRows =
      input.kind === "point" ? pointResult.images : geometryResult.images;
    return imageRows.filter((row) => row.plan_id === input.selectedPlan!.id);
  }, [input.selectedPlan, input.kind, pointResult.images, geometryResult.images]);

  return { pointResult, geometryResult, rowsForSelectedPlan };
}
