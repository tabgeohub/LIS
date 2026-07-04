import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "api-hooks/flightPlans";
import { useTemplateFlights } from "api-hooks/templateFlights";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import {
  buildPlanPointIdSet,
  filterPointsNotInPlan,
  mapSourceToItems,
  SelectFromSourceItem,
} from "./helpers/mapSourceItems";

type Source = "flightPlans" | "templates";

export function useSelectFromSourceData(source: Source) {
  const { user } = useAuth();
  const { selectedPlan } = useViewPlanState();

  const { data: flightPlansData, isPending: flightPlansPending } =
    useFlightPlansList({
      regioId: user.role,
      userId: user.user_id,
      enabled: source === "flightPlans",
    });
  const { data: templateData, isPending: templatePending } = useTemplateFlights({
    regioId: user.role,
    userId: user.user_id,
    enabled: source === "templates",
  });

  const data =
    source === "flightPlans" ? flightPlansData ?? EMPTY_FLIGHT_PLANS : templateData;
  const dataLoading =
    source === "flightPlans" ? flightPlansPending : templatePending;

  const items = useMemo(() => mapSourceToItems(source, data), [data, source]);
  const planPointIds = useMemo(
    () => buildPlanPointIdSet(selectedPlan?.points),
    [selectedPlan?.points]
  );

  const [selectedItem, setSelectedItem] = useState<SelectFromSourceItem | null>(null);
  const [selectedPointIds, setSelectedPointIds] = useState<number[]>([]);

  useEffect(() => {
    if (!selectedItem) {
      setSelectedPointIds([]);
      return;
    }
    setSelectedPointIds(
      filterPointsNotInPlan(selectedItem.points, planPointIds).map((p) => p.id)
    );
  }, [selectedItem, planPointIds]);

  return {
    items,
    planPointIds,
    selectedItem,
    setSelectedItem,
    selectedPointIds,
    setSelectedPointIds,
    dataLoading,
  };
}
