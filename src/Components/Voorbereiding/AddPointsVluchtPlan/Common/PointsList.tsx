/* eslint-disable react-hooks/exhaustive-deps */
import type { WizardPointsListSelectionProps } from "Components/HomePage/Body/Left/Common/wizardPointsListSelectionProps";
import WizardPointsList from "Components/HomePage/Body/Left/Common/WizardPointsList";

export default function PointsList({
  selectedPoints,
  setSelectedPoints,
  points,
}: WizardPointsListSelectionProps) {
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
