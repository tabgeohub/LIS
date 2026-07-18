import { useEffect, useMemo, useState } from "react";
import {
  filterPointsNotInPlan,
  SelectFromSourceItem,
} from "./helpers/mapSourceItems";

export function useSelectFromSourceSelection(planPointIds: Set<number>) {
  const [selectedItem, setSelectedItem] = useState<SelectFromSourceItem | null>(
    null
  );
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
    selectedItem,
    setSelectedItem,
    selectedPointIds,
    setSelectedPointIds,
  };
}
