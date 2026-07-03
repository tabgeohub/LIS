/* eslint-disable react-hooks/exhaustive-deps */
import { EnrichedPointType } from "Types";
import WizardPointsList from "Components/HomePage/Body/Left/Common/WizardPointsList";

export default function PointsList({
  selectedPoints,
  setSelectedPoints,
  points,
}: {
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  points: EnrichedPointType[];
}) {
  return (
    <WizardPointsList
      points={points}
      selectedPoints={selectedPoints}
      setSelectedPoints={setSelectedPoints}
      mapClick="hitTest"
      itemClick="singleOrClear"
      drawYellowMarkers
      hoverMode="graphicState"
    />
  );
}
