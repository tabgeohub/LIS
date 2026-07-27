import { useEffect, useState } from "react";
import type { FinishedFlightPlanType } from "Types/finished_plans";

function findPlanById(
  plans: FinishedFlightPlanType[],
  planId: number
): FinishedFlightPlanType | undefined {
  return plans.find((p) => p.id === planId);
}

function keepPlanIfPresent(
  plans: FinishedFlightPlanType[],
  prev: FinishedFlightPlanType | null
): FinishedFlightPlanType | null {
  if (!prev) return null;
  return plans.some((p) => p.id === prev.id) ? prev : null;
}

function resolveSelectedPlan(input: {
  filteredPlans: FinishedFlightPlanType[];
  planIdFromQuery: number | null;
  prev: FinishedFlightPlanType | null;
}): FinishedFlightPlanType | null {
  if (input.filteredPlans.length === 0) return null;

  if (input.planIdFromQuery != null) {
    const match = findPlanById(input.filteredPlans, input.planIdFromQuery);
    if (match) return match;
  }

  return (
    keepPlanIfPresent(input.filteredPlans, input.prev) ??
    input.filteredPlans[0]
  );
}

export function useTimesliderSelectedPlan(input: {
  filteredPlans: FinishedFlightPlanType[];
  planIdFromQuery: number | null;
}) {
  const [selectedPlan, setSelectedPlan] =
    useState<FinishedFlightPlanType | null>(null);

  useEffect(() => {
    setSelectedPlan((prev) =>
      resolveSelectedPlan({
        filteredPlans: input.filteredPlans,
        planIdFromQuery: input.planIdFromQuery,
        prev,
      })
    );
  }, [input.filteredPlans, input.planIdFromQuery]);

  return { selectedPlan, setSelectedPlan };
}

export function useClampedImageIndex(imageCount: number) {
  const imageKey = String(imageCount);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setSelectedIndex(0);
  }, [imageKey]);

  useEffect(() => {
    if (imageCount === 0) return;
    setSelectedIndex((i) => Math.min(i, imageCount - 1));
  }, [imageCount]);

  return { selectedIndex, setSelectedIndex };
}
