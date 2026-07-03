/* eslint-disable react-hooks/exhaustive-deps */
import { EnrichedPointType } from "Types";
import { useEffect, useMemo, useState } from "react";
import { useContent } from "hooks/useContent";
import WizardPointsList from "Components/HomePage/Body/Left/Common/WizardPointsList";

export default function PointsList({
  selectedPoints,
  setSelectedPoints,
  points,
  step,
  hideHeader,
}: {
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  points: EnrichedPointType[];
  step: number;
  hideHeader?: boolean;
}) {
  const [searchedPoints, setSearchedPoints] =
    useState<EnrichedPointType[]>(points);
  const [filterText, setFilterText] = useState("");
  const content = useContent();

  useEffect(() => {
    const q = filterText.trim().toLowerCase();
    setSearchedPoints(
      q
        ? points.filter((p) => (p.omschrijving ?? "").toLowerCase().includes(q))
        : points
    );
  }, [filterText, points]);

  const header = useMemo(() => {
    if (hideHeader) return null;
    return (
      <>
        <p className="text-gray-800 leading-3 text-[10px] p-3">
          {step === 2
            ? content.voorbereiding.vluchtenTemplate.step2.text
            : content.voorbereiding.vluchtenTemplate.step3.text}
        </p>
        <input
          type="text"
          placeholder="Filter resultaten"
          className="inputClass !rounded-lg !px-2 !py-0 !pb-0.5 placeholder:text-[10px]"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </>
    );
  }, [hideHeader, step, content, filterText]);

  return (
    <WizardPointsList
      points={searchedPoints}
      selectedPoints={selectedPoints}
      setSelectedPoints={setSelectedPoints}
      mapClick="nearest"
      itemClick="toggle"
      drawYellowMarkers
      header={header}
      hoverMode="pointHover"
    />
  );
}
