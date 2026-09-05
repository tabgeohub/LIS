/* eslint-disable react-hooks/exhaustive-deps */
import type { WizardPointsListSelectionProps } from "Components/Common/wizardPointsListSelectionProps";
import WizardPointsList from "Components/Common/WizardPointsList";
import usePointClick from "hooks/hover-click/usePointClick";
import { useEffect } from "react";
import useLogAction from "hooks/useLogAction";
import { getPointsSelectionStep } from "helpers/points/pointsSelectionLog";

export default function PointsList({
  selectedPoints,
  setSelectedPoints,
  points,
}: WizardPointsListSelectionProps) {
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
