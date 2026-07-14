import { useContent } from "hooks/useContent";
import {
  useGeometriesStore,
  Geometry,
} from "hooks/features/useGeometriesStore";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { useEffect, useState } from "react";
import SelectableGeometryList from "./SelectableGeometryList";

export default function NewGeometriesList() {
  const { selectedPlan, newGeometries, setNewGeometries } =
    useReuseFlightPlan();
  const { dbGeometries } = useGeometriesStore();
  const [planGeometries, setPlanGeometries] = useState<Geometry[]>([]);

  // Get geometries that are not in the selected plan
  useEffect(() => {
    const planGeoms = (selectedPlan as any)?.geometries || [];
    const planGeometryIds = planGeoms.map((g: any) => g.id);

    const availableGeometries = dbGeometries.filter(
      (geometry) => !planGeometryIds.includes(geometry.id)
    );

    setPlanGeometries(availableGeometries);
  }, [dbGeometries, selectedPlan]);

  const content = useContent();

  // Don't render if no geometries available
  if (!planGeometries || planGeometries.length === 0) {
    return null;
  }

  return (
    <>
      <p className="text-[12px] text-gray-700 px-2">
        {content.voorbereiding.vluchtplanHergebruiken.step2.text3} (Geometrieën)
      </p>

      <SelectableGeometryList
        geometries={planGeometries}
        selectedIds={newGeometries}
        setSelectedIds={setNewGeometries}
        showTypeIcon
      />
    </>
  );
}
