import { useTemplateFlightState } from "../../templateFlightStates";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import { EnrichedPointType } from "Types";
import PointsList from "../../PointsList";
import GeometriesList from "../../../FlightPlan/Common/GeometriesList";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import { useState, useEffect, useMemo } from "react";

export default function Step3({
  name,
  setOpenFilter,
  filteredPoints,
}: {
  name: string;
  setOpenFilter: (value: boolean) => void;
  filteredPoints: EnrichedPointType[];
}) {
  const { selectedPoints2, setSelectedPoints2 } = useTemplateFlightState();
  const { dbGeometries, setGeometries } = useGeometriesStore();
  const [selectedGeometries, setSelectedGeometries] = useState<number[]>([]);
  const [filteredGeometries, setFilteredGeometries] = useState<Geometry[]>([]);

  useEffect(() => {
    const notHerhalenGeometries = dbGeometries.filter((geometry) => {
      const herhalenValue =
        typeof geometry.herhalen === "number"
          ? geometry.herhalen === 0
          : typeof geometry.herhalen === "string"
            ? geometry.herhalen === "0"
            : geometry.herhalen === false;
      return herhalenValue;
    });

    setGeometries(notHerhalenGeometries);
    setFilteredGeometries(notHerhalenGeometries);
  }, [dbGeometries, setGeometries]);

  const displayedGeometries = useMemo(
    () => filteredGeometries,
    [filteredGeometries]
  );

  return (
    <ScrollButtonsLayout
      className="h-[100%]"
      buttons={<Buttons setOpenFilter={setOpenFilter} name={name} />}
    >
      <GeometriesList
        selectedGeometries={selectedGeometries}
        setSelectedGeometries={setSelectedGeometries}
        geometries={displayedGeometries}
      />
      <PointsList
        selectedPoints={selectedPoints2}
        setSelectedPoints={setSelectedPoints2}
        points={filteredPoints.filter((point) => point.herhalen === 0)}
        step={3}
      />
    </ScrollButtonsLayout>
  );
}
