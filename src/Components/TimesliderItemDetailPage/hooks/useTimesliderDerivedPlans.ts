import { useMemo } from "react";
import {
  filterFinishedPlansContainingItem,
  getItemDisplayTitle,
} from "@helpers/timeslider";
import type { FinishedFlightPlanType } from "Types/finished_plans";

export function useTimesliderDerivedPlans(input: {
  ok: boolean;
  plans: FinishedFlightPlanType[];
  kind: "point" | "geometry";
  itemId: number;
}) {
  const filteredPlans = useMemo(
    () =>
      input.ok
        ? filterFinishedPlansContainingItem({
            plans: input.plans,
            kind: input.kind,
            itemId: input.itemId,
          })
        : [],
    [input.plans, input.ok, input.kind, input.itemId]
  );

  const planIds = useMemo(
    () => filteredPlans.map((plan) => plan.id),
    [filteredPlans]
  );

  const displayTitle = useMemo(
    () =>
      input.ok
        ? getItemDisplayTitle({
            plans: filteredPlans.length ? filteredPlans : input.plans,
            kind: input.kind,
            itemId: input.itemId,
          })
        : "",
    [input.ok, filteredPlans, input.plans, input.kind, input.itemId]
  );

  return { filteredPlans, planIds, displayTitle };
}
