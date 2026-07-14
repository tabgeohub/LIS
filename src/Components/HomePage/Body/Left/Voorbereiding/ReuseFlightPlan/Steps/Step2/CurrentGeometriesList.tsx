/* eslint-disable react-hooks/exhaustive-deps */
import { useContent } from "hooks/useContent";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { useEffect, useState } from "react";
import {
  useGeometriesStore,
  Geometry,
} from "hooks/features/useGeometriesStore";
import SelectableGeometryList from "./SelectableGeometryList";

export default function CurrentGeometriesList() {
  const { selectedPlan, currentGeometries, setCurrentGeometries } =
    useReuseFlightPlan();
  const { dbGeometries } = useGeometriesStore();
  const [planGeometries, setPlanGeometries] = useState<Geometry[]>([]);

  // Get geometries from plan if available, otherwise from store
  useEffect(() => {
    if (!selectedPlan) return;

    // Check if plan has geometries property (for finished plans)
    const planGeoms = (selectedPlan as any).geometries;
    if (planGeoms && Array.isArray(planGeoms)) {
      // Plan has geometries, use them
      const geometries = dbGeometries.filter((g) =>
        planGeoms.some((pg: any) => pg.id === g.id)
      );
      setPlanGeometries(geometries);
      setCurrentGeometries(geometries.flatMap((g) => g.id));
    } else {
      // Plan doesn't have geometries, check if we can infer from points
      // For now, set empty array
      setPlanGeometries([]);
      setCurrentGeometries([]);
    }
  }, [selectedPlan, dbGeometries, setCurrentGeometries]);

  const content = useContent();

  // Don't render if no geometries available
  if (!planGeometries || planGeometries.length === 0) {
    return null;
  }

  return (
    <div className="px-2">
      <p className="text-[12px] text-gray-700 pt-1.5">
        {content.voorbereiding.vluchtplanHergebruiken.step2.geometriesText1}
      </p>

      <p className="text-[12px] text-gray-700 pt-2">
        {content.voorbereiding.vluchtplanHergebruiken.step2.geometriesText2}
      </p>

      <SelectableGeometryList
        geometries={planGeometries}
        selectedIds={currentGeometries}
        setSelectedIds={setCurrentGeometries}
      />
    </div>
  );
}
