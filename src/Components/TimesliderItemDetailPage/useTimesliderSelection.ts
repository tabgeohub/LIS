import { useEffect, useState } from "react";
import type { FinishedFlightPlanType } from "Types/finished_plans";

function resolveSelectedPlan(
  filteredPlans: FinishedFlightPlanType[],
  planIdFromQuery: number | null,
  prev: FinishedFlightPlanType | null
): FinishedFlightPlanType | null {
  if (filteredPlans.length === 0) return null;

  if (planIdFromQuery != null) {
    const match = filteredPlans.find((p) => p.id === planIdFromQuery);
    if (match) return match;
  }

  if (prev && filteredPlans.some((p) => p.id === prev.id)) return prev;
  return filteredPlans[0];
}

export function useTimesliderSelectedPlan(input: {
  filteredPlans: FinishedFlightPlanType[];
  planIdFromQuery: number | null;
}) {
  const [selectedPlan, setSelectedPlan] =
    useState<FinishedFlightPlanType | null>(null);

  useEffect(() => {
    setSelectedPlan((prev) =>
      resolveSelectedPlan(input.filteredPlans, input.planIdFromQuery, prev)
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
