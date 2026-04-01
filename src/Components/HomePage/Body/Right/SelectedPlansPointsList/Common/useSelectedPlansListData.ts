import { useMemo } from "react";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { buildListItems, collectSelectedData } from "@helpers/timeslider";

export function useSelectedPlansListData() {
  const { plans, selectedPlanIds } = useTimesliderState();
  return useMemo(() => {
    const { points, geometries } = collectSelectedData(plans, selectedPlanIds);
    return buildListItems(points, geometries);
  }, [plans, selectedPlanIds]);
}
