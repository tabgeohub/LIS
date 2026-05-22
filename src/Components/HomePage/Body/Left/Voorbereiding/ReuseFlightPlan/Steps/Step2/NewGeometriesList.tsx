import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useContent } from "hooks/useContent";
import {
  useGeometriesStore,
  Geometry,
} from "hooks/features/useGeometriesStore";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { useEffect, useState } from "react";
import { TbLine, TbPolygon } from "react-icons/tb";

export default function NewGeometriesList() {
  const { selectedPlan, newGeometries, setNewGeometries } =
    useReuseFlightPlan();
  const { graphicsLayer } = useMapViewState();
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

  function handleGeometryChange(id: number) {
    if (newGeometries.includes(id)) {
      setNewGeometries(newGeometries.filter((g) => g !== id));
    } else {
      setNewGeometries([...newGeometries, id]);
    }
  }

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

      <div className="pr-2 mt-2 mb-4 pl-10">
        <div className="mt-2 border w-full border-gray-300 overflow-y-scroll">
          {planGeometries.map((geometry) => (
            <div
              key={geometry.id}
              onClick={() => handleGeometryChange(geometry.id)}
              className={`flex cursor-pointer items-center gap-x-2 px-1.5 pt-0.5 ${
                newGeometries.includes(geometry.id) ? "bg-gray-200" : ""
              }`}
            >
              <input
                type="checkbox"
                className="size-3 cursor-pointer"
                checked={newGeometries.includes(geometry.id)}
                onChange={() => handleGeometryChange(geometry.id)}
              />
              <div className="flex items-center gap-x-2">
                {geometry.type === "polygon" ? (
                  <TbPolygon className="size-4 text-yellow-500" />
                ) : (
                  <TbLine className="size-4 text-green-500" />
                )}
                <label className="text-[12px] cursor-pointer">
                  {geometry.omschrijving || `Geometrie ${geometry.id}`}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
