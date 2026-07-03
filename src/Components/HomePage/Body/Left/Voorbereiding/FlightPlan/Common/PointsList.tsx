/* eslint-disable react-hooks/exhaustive-deps */
import { EnrichedPointType } from "Types";
import usePointClick from "hooks/hover-click-handlers/usePointClick";
import { useEffect } from "react";
import useLogAction from "hooks/useLogAction";
import WizardPointsList from "Components/HomePage/Body/Left/Common/WizardPointsList";
import { getPointsSelectionStep } from "hooks/points/pointsSelectionLog";

export default function PointsList({
  selectedPoints,
  setSelectedPoints,
  points,
}: {
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  points: EnrichedPointType[];
}) {
  const logAction = useLogAction();

  usePointClick(points.filter((point) => selectedPoints.includes(point.id)));

  useEffect(() => {
    logAction({
      message: `User is selecting points`,
      step: `Step ${getPointsSelectionStep(points)}`,
      newData: { selectedPoints },
    });
  }, [selectedPoints]);

  return (
    <WizardPointsList
      points={points}
      selectedPoints={selectedPoints}
      setSelectedPoints={setSelectedPoints}
      mapClick="nearest"
      itemClick="single"
      hoverMode="pointHover"
    />
  );
}
