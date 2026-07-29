import { useMemo } from "react";
import { useRenderLocalGeometries } from "Components/HomePage/hooks/features/useRenderLocalGeometries";
import { useHoverPointsAndGeometries } from "Components/HomePage/hooks/features/useHoverPointsAndGeometries";
import { useStepContentMapSync } from "./useStepContentMapSync";
import { useStepContentDataInit } from "./useStepContentDataInit";
import {
  useStepContentDisplayed,
  useStepContentLocalState,
} from "./useStepContentDisplayed";

export function useStepContentHooks(props: {
  herhalen: boolean;
  filteredPoints: any[];
  setFilteredPoints: (value: any[]) => void;
  selectedPlan: any;
}) {
  const local = useStepContentLocalState();
  const selectedPlanPointIds = useMemo(
    () => props.selectedPlan?.points?.map((p: { id: number }) => p.id) ?? [],
    [props.selectedPlan?.points]
  );
  const displayed = useStepContentDisplayed({
    filteredPoints: props.filteredPoints,
    filteredGeometries: local.filteredGeometries,
    selectedPlanPointIds,
    filterTerm: local.filterTerm,
  });
  useStepContentDataInit({
    herhalen: props.herhalen,
    selectedPlanPointIds,
    setFilteredPoints: props.setFilteredPoints,
    setFilteredGeometries: local.setFilteredGeometries,
  });
  useStepContentMapSync(displayed.displayedPoints);
  useRenderLocalGeometries(displayed.displayedGeometries);
  useHoverPointsAndGeometries({ checkMapContainer: true });
  return { ...local, ...displayed };
}
