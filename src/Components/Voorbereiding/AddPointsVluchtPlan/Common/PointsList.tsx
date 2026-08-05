/* eslint-disable react-hooks/exhaustive-deps */
import type { WizardPointsListSelectionProps } from "Components/Common/wizardPointsListSelectionProps";
import WizardPointsList from "Components/Common/WizardPointsList";

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
