import { useTemplateFlightState } from "../../templateFlightStates";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import { EnrichedPointType } from "Types";
import PointsList from "../../PointsList";
import GeometriesList from "../../../FlightPlan/Common/GeometriesList";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import { useState, useEffect, useMemo } from "react";
import { useContent } from "hooks/useContent";

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

  const [filterText, setFilterText] = useState("");

  const displayedGeometries = useMemo(
    () => filteredGeometries.filter((geometry) =>
      geometry.omschrijving
        .toLowerCase()
        .includes(filterText.toLowerCase())
    ),
    [filteredGeometries, filterText]
  );

  const filteredPointsList = useMemo(
    () => filteredPoints.filter((point) => 
      point.herhalen === 0 && 
      point.omschrijving
        .toLowerCase()
        .includes(filterText.toLowerCase())
    ),
    [filteredPoints, filterText]
  );

  const content = useContent();

  return (
    <ScrollButtonsLayout
      className="h-[100%]"
      buttons={<Buttons setOpenFilter={setOpenFilter} name={name} selectedGeometries={selectedGeometries} setSelectedGeometries={setSelectedGeometries} />}
    >
      <p className="text-gray-800 leading-3 text-[10px] p-3">
        {content.voorbereiding.vluchtenTemplate.step3.text}
      </p>

      <input
        type="text"
        placeholder="Filter resultaten"
        className="inputClass !rounded-lg !px-2 !py-0 !pb-0.5 placeholder:text-[10px]"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <GeometriesList
        selectedGeometries={selectedGeometries}
        setSelectedGeometries={setSelectedGeometries}
        geometries={displayedGeometries}
      />

      <PointsList
        selectedPoints={selectedPoints2}
        setSelectedPoints={setSelectedPoints2}
        points={filteredPointsList}
        step={3}
        hideHeader={true}
      />
    </ScrollButtonsLayout>
  );
}
