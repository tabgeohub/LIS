import { useMemo } from "react";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import {
  buildPlanPointIdSet,
  mapSourceToItems,
} from "./helpers/mapSourceItems";
import { useSelectFromSourceQuery } from "./useSelectFromSourceQuery";
import { useSelectFromSourceSelection } from "./useSelectFromSourceSelection";

type Source = "flightPlans" | "templates";

export function useSelectFromSourceData(source: Source) {
  const { selectedPlan } = useViewPlanState();
  const { data, dataLoading } = useSelectFromSourceQuery(source);
  const items = useMemo(
    () => mapSourceToItems({ source, data }),
    [data, source]
  );
  const planPointIds = useMemo(
    () => buildPlanPointIdSet(selectedPlan?.points),
    [selectedPlan?.points]
  );
  const selection = useSelectFromSourceSelection(planPointIds);
  return { items, planPointIds, dataLoading, ...selection };
}
