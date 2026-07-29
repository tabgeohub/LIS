import { useEffect, useState } from "react";
import { useFinishedPlansState } from "Components/HomePage/hooks/zustand/nabewerking/useFinishedPlansState";
import { useWaarnemingenFilteredCollections } from "./useWaarnemingenFilteredCollections";

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
  const { filteredPoints, filteredGeometries } =
    useWaarnemingenFilteredCollections(selectedPlan, value);

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
