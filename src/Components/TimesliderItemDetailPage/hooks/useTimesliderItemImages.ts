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

function buildPlanImagesEnabled(input: {
  ok: boolean;
  kind: "point" | "geometry";
  actualKind: "point" | "geometry";
  planIds: number[];
  regioId: string | undefined;
}) {
  return imagesEnabled({
    ok: input.ok,
    regioId: input.regioId,
    planIds: input.planIds,
    kind: input.kind,
    actualKind: input.actualKind,
  });
}

export function useTimesliderItemImages(input: {
  ok: boolean;
  kind: "point" | "geometry";
  itemId: number;
  planIds: number[];
  regioId: string | undefined;
  selectedPlan: FinishedFlightPlanType | null;
}) {
  const enabled = buildPlanImagesEnabled({
    ok: input.ok,
    kind: input.kind,
    actualKind: input.kind,
    planIds: input.planIds,
    regioId: input.regioId,
  });

  const pointResult = usePointPlanImages({
    pointId: input.itemId,
    planIds: input.planIds,
    regioId: input.regioId,
    enabled: enabled && input.kind === "point",
  });

  const geometryResult = useGeometryPlanImages({
    geometryId: input.itemId,
    planIds: input.planIds,
    regioId: input.regioId,
    enabled: enabled && input.kind === "geometry",
  });

  const rowsForSelectedPlan = useMemo(() => {
    if (!input.selectedPlan) return [];
    const imageRows =
      input.kind === "point" ? pointResult.images : geometryResult.images;
    return imageRows.filter((row) => row.plan_id === input.selectedPlan!.id);
  }, [input.selectedPlan, input.kind, pointResult.images, geometryResult.images]);

  return { pointResult, geometryResult, rowsForSelectedPlan };
}
