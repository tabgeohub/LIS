import { ReactNode, useCallback, useMemo } from "react";
import { EnrichedPointType } from "Types";
import { useHoveredGraphicState } from "hooks/zustand/ui";
import usePointHover from "hooks/hover-click/usePointHover";
import useDrawYellowMarkers from "hooks/hover-click/useDrawYellowMarkers";
import useNearestPointClick from "hooks/hover-click/useNearestPointClick";
import useLogAction from "hooks/useLogAction";
import PointItemCheckBox from "Components/Common/PointItem/PointItemCheckBox";
import { sortPointsWithSelectionOrder } from "helpers/points/sortPointsWithSelectionOrder";
import { useMapPointSelectionClick } from "hooks/viewPlan/useMapPointSelectionClick";
import { getPointsSelectionStep } from "helpers/points/pointsSelectionLog";

export type WizardPointsListProps = {
  points: EnrichedPointType[];
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  mapClick?: "nearest" | "hitTest" | "none";
  itemClick?: "toggle" | "single" | "singleOrClear";
  drawYellowMarkers?: boolean;
  hoverMode?: "pointHover" | "graphicState";
  header?: ReactNode;
};

function togglePointInList(input: {
  pointId: number;
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
}) {
  if (input.selectedPoints.includes(input.pointId)) {
    input.setSelectedPoints(
      input.selectedPoints.filter((id) => id !== input.pointId)
    );
  } else {
    input.setSelectedPoints([...input.selectedPoints, input.pointId]);
  }
}

export default function WizardPointsList({
  points,
  selectedPoints,
  setSelectedPoints,
  mapClick = "none",
  itemClick = "toggle",
  drawYellowMarkers = false,
  hoverMode = "pointHover",
  header,
}: WizardPointsListProps) {
  const logAction = useLogAction();
  const { setHovered } = useHoveredGraphicState();
  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();

  const handlePointClick = useCallback(
    (point: EnrichedPointType) => {
      if (itemClick === "single") {
        setSelectedPoints([point.id]);
        return;
      }
      if (itemClick === "singleOrClear") {
        if (selectedPoints.length === 1 && selectedPoints[0] === point.id) {
          setSelectedPoints([]);
        } else {
          setSelectedPoints([point.id]);
        }
        return;
      }
      togglePointInList({
        pointId: point.id,
        selectedPoints,
        setSelectedPoints,
      });
    },
    [itemClick, selectedPoints, setSelectedPoints]
  );

  useNearestPointClick({
    points,
    onPointClick: handlePointClick,
    maxDistanceMeters: 5000,
    enabled: mapClick === "nearest",
  });

  useMapPointSelectionClick({
    onPointClick: handlePointClick,
    enabled: mapClick === "hitTest",
  });

  useDrawYellowMarkers({
    selectedPointIds: drawYellowMarkers ? selectedPoints : [],
    points: drawYellowMarkers ? points : [],
    onPointsDrawn: (selectedPointIds) => {
      if (!drawYellowMarkers) return;
      logAction({
        message: "User is selecting points",
        step: `Step ${getPointsSelectionStep(points)}`,
        newData: { selectedPoints: selectedPointIds },
      });
    },
  });

  const sortedPoints = useMemo(
    () => sortPointsWithSelectionOrder(points, selectedPoints),
    [points, selectedPoints]
  );

  const onMouseEnter = (point: EnrichedPointType) => {
    if (hoverMode === "graphicState") {
      setHovered({ id: point.id, label: point.omschrijving || "" });
      return;
    }
    handleHoveredPoint(point);
  };

  const onMouseLeave = () => {
    if (hoverMode === "graphicState") {
      setHovered(null);
      return;
    }
    handleRemoveHoverePoint();
  };

  return (
    <>
      {header}
      {sortedPoints.map((point) => (
        <PointItemCheckBox
          key={point.id}
          point={point}
          isSelected={selectedPoints.includes(point.id)}
          onMouseEnter={() => onMouseEnter(point)}
          onMouseLeave={onMouseLeave}
          onCheckboxClick={(e) => {
            e.stopPropagation();
            togglePointInList({
              pointId: point.id,
              selectedPoints,
              setSelectedPoints,
            });
          }}
          onItemClick={() => handlePointClick(point)}
        />
      ))}
    </>
  );
}
