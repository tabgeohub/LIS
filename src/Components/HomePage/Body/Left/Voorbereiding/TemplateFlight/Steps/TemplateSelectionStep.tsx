import { ReactNode, useEffect, useMemo, useState } from "react";
import { matchesGeometryRepeat } from "@helpers/geometry/matchesGeometryRepeat";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { Geometry, useGeometriesStore } from "hooks/features/useGeometriesStore";
import { EnrichedPointType } from "Types";
import GeometriesList from "../../FlightPlan/Common/GeometriesList";
import PointsList from "../PointsList";

type TemplateSelectionStepProps = {
  repeat: boolean;
  text: string;
  step: number;
  filteredPoints: EnrichedPointType[];
  selectedPoints: number[];
  setSelectedPoints: (points: number[]) => void;
  selectedGeometries: number[];
  setSelectedGeometries: (geometries: number[]) => void;
  buttons: ReactNode;
};

export default function TemplateSelectionStep({
  repeat,
  text,
  step,
  filteredPoints,
  selectedPoints,
  setSelectedPoints,
  selectedGeometries,
  setSelectedGeometries,
  buttons,
}: TemplateSelectionStepProps) {
  const { dbGeometries, setGeometries } = useGeometriesStore();
  const [matchingGeometries, setMatchingGeometries] = useState<Geometry[]>([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const matches = dbGeometries.filter((geometry) =>
      matchesGeometryRepeat(geometry, repeat)
    );
    setGeometries(matches);
    setMatchingGeometries(matches);
  }, [dbGeometries, repeat, setGeometries]);

  const normalizedFilter = filterText.toLowerCase();
  const displayedGeometries = useMemo(
    () =>
      matchingGeometries.filter((geometry) =>
        geometry.omschrijving.toLowerCase().includes(normalizedFilter)
      ),
    [matchingGeometries, normalizedFilter]
  );
  const displayedPoints = useMemo(
    () =>
      filteredPoints.filter(
        (point) =>
          point.herhalen === (repeat ? 1 : 0) &&
          point.omschrijving.toLowerCase().includes(normalizedFilter)
      ),
    [filteredPoints, normalizedFilter, repeat]
  );

  return (
    <ScrollButtonsLayout className="h-[100%]" buttons={buttons}>
      <p className="text-gray-800 leading-3 text-[10px] p-3">{text}</p>
      <input
        type="text"
        placeholder="Filter resultaten"
        className="inputClass !rounded-lg !px-2 !py-0 !pb-0.5 placeholder:text-[10px]"
        value={filterText}
        onChange={(event) => setFilterText(event.target.value)}
      />
      <GeometriesList
        selectedGeometries={selectedGeometries}
        setSelectedGeometries={setSelectedGeometries}
        geometries={displayedGeometries}
      />
      <PointsList
        selectedPoints={selectedPoints}
        setSelectedPoints={setSelectedPoints}
        points={displayedPoints}
        step={step}
        hideHeader
      />
    </ScrollButtonsLayout>
  );
}
