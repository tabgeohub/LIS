/* eslint-disable react-hooks/exhaustive-deps */
import { useContent } from "hooks/useContent";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { useEffect, useState } from "react";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";

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

  function handleGeometryChange(id: number) {
    if (currentGeometries.includes(id)) {
      setCurrentGeometries(currentGeometries.filter((g) => g !== id));
    } else {
      setCurrentGeometries([...currentGeometries, id]);
    }
  }

  const content = useContent();

  // Don't render if no geometries available
  if (!planGeometries || planGeometries.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-[12px] text-gray-700 pt-1.5">
        {content.voorbereiding.vluchtplanHergebruiken.step2.text1} (Geometrieën)
      </p>

      <p className="text-[12px] text-gray-700 pt-2">
        {content.voorbereiding.vluchtplanHergebruiken.step2.text2}
      </p>

      <div className="pr-2 mt-2 mb-4 pl-10">
        <div className="mt-2 border w-full border-gray-300 overflow-y-scroll">
          {planGeometries.map((geometry) => (
            <div
              key={geometry.id}
              onClick={() => handleGeometryChange(geometry.id)}
              className={`flex items-center cursor-pointer gap-x-2 px-1.5 pt-0.5 ${
                currentGeometries.includes(geometry.id) ? "bg-gray-200" : ""
              }`}
            >
              <input
                type="checkbox"
                className="size-3 cursor-pointer"
                checked={currentGeometries.includes(geometry.id)}
                onChange={() => handleGeometryChange(geometry.id)}
              />
              <label className="text-[12px] cursor-pointer">
                {geometry.omschrijving || `Geometrie ${geometry.id}`}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


