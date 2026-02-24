import ScrollButtonsLayout from "../../../../Common/ScrollButtonsLayout";
import PointsList from "../../PointsList";
import GeometriesList from "../../../FlightPlan/Common/GeometriesList";
import { useTemplateFlightState } from "../../templateFlightStates";
import Buttons from "./Buttons";
import { EnrichedPointType } from "Types";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import { useState, useEffect, useMemo } from "react";

export default function Step2({
  setOpenFilter,
  filteredPoints,
}: {
  setOpenFilter: (value: boolean) => void;
  filteredPoints: EnrichedPointType[];
}) {
  const { selectedPoints, setSelectedPoints } = useTemplateFlightState();
  const { dbGeometries, setGeometries } = useGeometriesStore();
  const [selectedGeometries, setSelectedGeometries] = useState<number[]>([]);
  const [filteredGeometries, setFilteredGeometries] = useState<Geometry[]>([]);

  useEffect(() => {
    const herhalenGeometries = dbGeometries.filter((geometry) => {
      const herhalenValue =
        typeof geometry.herhalen === "number"
          ? geometry.herhalen === 1
          : typeof geometry.herhalen === "string"
            ? geometry.herhalen === "1"
            : geometry.herhalen === true;
      return herhalenValue;
    });

    setGeometries(herhalenGeometries);
    setFilteredGeometries(herhalenGeometries);
  }, [dbGeometries, setGeometries]);

  const displayedGeometries = useMemo(
    () => filteredGeometries,
    [filteredGeometries]
  );

  return (
    <ScrollButtonsLayout
      className="h-[100%]"
      buttons={<Buttons setOpenFilter={setOpenFilter} />}
    >
      <GeometriesList
        selectedGeometries={selectedGeometries}
        setSelectedGeometries={setSelectedGeometries}
        geometries={displayedGeometries}
      />
      <PointsList
        selectedPoints={selectedPoints}
        setSelectedPoints={setSelectedPoints}
        points={filteredPoints.filter((point) => point.herhalen === 1)}
        step={2}
      />
    </ScrollButtonsLayout>
  );
}
