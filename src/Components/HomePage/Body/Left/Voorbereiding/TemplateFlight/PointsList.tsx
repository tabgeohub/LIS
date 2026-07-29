/* eslint-disable react-hooks/exhaustive-deps */
import { EnrichedPointType } from "Types";
import { useContent } from "hooks/useContent";
import WizardPointsList from "Components/HomePage/Body/Left/Common/WizardPointsList";
import { useWizardPointsFilterHeader } from "Components/HomePage/hooks/points/useWizardPointsFilterHeader";

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
  const content = useContent();
  const introText =
    step === 2
      ? content.voorbereiding.vluchtenTemplate.step2.text
      : content.voorbereiding.vluchtenTemplate.step3.text;

  const { searchedPoints, header } = useWizardPointsFilterHeader({
    points,
    hideHeader,
    introText,
  });

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
