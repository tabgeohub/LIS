/* eslint-disable react-hooks/exhaustive-deps */
import { useContent } from "hooks/useContent";
import { useReuseFlightPlan } from "Components/Voorbereiding/ReuseFlightPlan/useReuseFlightPlan";
import { useEffect, useState } from "react";
import {
  useGeometriesStore,
  Geometry,
} from "hooks/features";
import SelectableGeometryList from "./SelectableGeometryList";

function resolvePlanGeometries(input: {
  selectedPlan: NonNullable<
    ReturnType<typeof useReuseFlightPlan>["selectedPlan"]
  >;
  dbGeometries: Geometry[];
}): Geometry[] {
  const planGeoms = (input.selectedPlan as { geometries?: { id: number }[] })
    .geometries;
  if (!planGeoms || !Array.isArray(planGeoms)) return [];

  return input.dbGeometries.filter((g) =>
    planGeoms.some((pg) => pg.id === g.id)
  );
}

export default function CurrentGeometriesList() {
  const { selectedPlan, currentGeometries, setCurrentGeometries } =
    useReuseFlightPlan();
  const { dbGeometries } = useGeometriesStore();
  const [planGeometries, setPlanGeometries] = useState<Geometry[]>([]);

  useEffect(() => {
    if (!selectedPlan) return;
    const geometries = resolvePlanGeometries({ selectedPlan, dbGeometries });
    setPlanGeometries(geometries);
    setCurrentGeometries(geometries.flatMap((g) => g.id));
  }, [selectedPlan, dbGeometries, setCurrentGeometries]);

  const content = useContent();

  if (!planGeometries.length) return null;

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
