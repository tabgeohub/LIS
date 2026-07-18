import { useEffect, useMemo, useState } from "react";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import {
  filterWaarnemingenGeometries,
  filterWaarnemingenPoints,
} from "./waarnemingenFilterHelpers";

export function useWaarnemingenFilters() {
  const {
    selectedPlan,
    selectedPoint,
    setSelectedPoint,
    selectedGeometry,
    setSelectedGeometry,
  } = useFinishedPlansState();
  const [value, setValue] = useState("");
  const [openEdit, setOpenEdit] = useState(false);

  const filteredPoints = useMemo(
    () => filterWaarnemingenPoints(selectedPlan?.points_data, value),
    [value, selectedPlan?.points_data]
  );
  const filteredGeometries = useMemo(
    () => filterWaarnemingenGeometries(selectedPlan?.geometries, value),
    [value, selectedPlan?.geometries]
  );

  useEffect(() => {
    setValue("");
  }, [openEdit]);

  return {
    selectedPoint,
    setSelectedPoint,
    selectedGeometry,
    setSelectedGeometry,
    value,
    setValue,
    openEdit,
    setOpenEdit,
    filteredPoints,
    filteredGeometries,
  };
}
