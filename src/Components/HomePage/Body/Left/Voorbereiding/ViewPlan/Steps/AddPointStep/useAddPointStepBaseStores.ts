import { useState } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEnrichedPointState } from "../../../../../../../../hooks/zustand/useEnrichedPointState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";

export function useAddPointStepBaseStores() {
  const [addPointStep, setAddPointStep] = useState(1);
  const map = useMapViewState();
  const { setSelectedTab } = useTabState();
  const { setOpenTable } = useOpenTable();
  const { setOpenFilter } = useViewPlanState();
  const point = useEnrichedPointState();
  return {
    addPointStep,
    setAddPointStep,
    map,
    setSelectedTab,
    setOpenTable,
    setOpenFilter,
    point,
  };
}
