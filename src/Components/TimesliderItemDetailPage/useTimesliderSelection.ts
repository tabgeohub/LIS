import { useEffect, useState } from "react";
import type { FinishedFlightPlanType } from "Types/finished_plans";

export function useTimesliderSelectedPlan(input: {
  filteredPlans: FinishedFlightPlanType[];
  planIdFromQuery: number | null;
}) {
  const [selectedPlan, setSelectedPlan] =
    useState<FinishedFlightPlanType | null>(null);

  useEffect(() => {
    if (input.filteredPlans.length === 0) {
      setSelectedPlan(null);
      return;
    }

    if (input.planIdFromQuery != null) {
      const match = input.filteredPlans.find((p) => p.id === input.planIdFromQuery);
      if (match) {
        setSelectedPlan(match);
        return;
      }
    }

    setSelectedPlan((prev) => {
      if (prev && input.filteredPlans.some((p) => p.id === prev.id)) return prev;
      return input.filteredPlans[0];
    });
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
