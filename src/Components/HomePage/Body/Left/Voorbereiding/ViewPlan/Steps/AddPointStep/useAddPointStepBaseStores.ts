import { useState } from "react";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useEnrichedPointState } from "../../../../../../../../hooks/zustand/useEnrichedPointState";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useOpenTable } from "hooks/zustand/ui/showTable";
import { useViewPlanState } from "Components/HomePage/hooks/zustand/voorbereiding/useViewPlanState";

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
