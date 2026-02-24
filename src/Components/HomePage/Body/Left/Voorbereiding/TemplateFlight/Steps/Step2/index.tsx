import ScrollButtonsLayout from "../../../../Common/ScrollButtonsLayout";
import PointsList from "../../PointsList";
import GeometriesList from "../../../FlightPlan/Common/GeometriesList";
import { useTemplateFlightState } from "../../templateFlightStates";
import Buttons from "./Buttons";
import { EnrichedPointType } from "Types";
import { useGeometriesStore, Geometry } from "hooks/features/useGeometriesStore";
import { useState, useEffect, useMemo } from "react";
import { useContent } from "hooks/useContent";

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
      point.herhalen === 1 &&
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
      buttons={<Buttons setOpenFilter={setOpenFilter} setSelectedGeometries={setSelectedGeometries} />}
    >
      <p className="text-gray-800 leading-3 text-[10px] p-3">
        {content.voorbereiding.vluchtenTemplate.step2.text}
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
        selectedPoints={selectedPoints}
        setSelectedPoints={setSelectedPoints}
        points={filteredPointsList}
        step={2}
        hideHeader={true}
      />
    </ScrollButtonsLayout>
  );
}
