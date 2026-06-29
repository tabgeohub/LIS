/* eslint-disable react-hooks/exhaustive-deps */
import { EnrichedPointType } from "Types";
import usePointHover from "hooks/hover-click-handlers/usePointHover";
import usePointClick from "hooks/hover-click-handlers/usePointClick";
import { useEffect, useMemo, useCallback } from "react";
import useLogAction from "hooks/useLogAction";
import useNearestPointClick from "hooks/hover-click-handlers/useNearestPointClick";
import PointItemCheckBox from "Components/HomePage/Body/Left/Common/PointItemCheckBox";
import { sortPointsWithSelectionOrder } from "hooks/points/sortPointsWithSelectionOrder";

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
  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();

  useEffect(() => {
    const step = points.at(0)?.herhalen === 1 ? 2 : 3;

    logAction({
      message: `User is selecting points`,
      step: `Step ${step}`,
      newData: {
        selectedPoints: selectedPoints,
      },
    });
  }, [selectedPoints]);

  const handlePointClick = useCallback((point: EnrichedPointType) => {
    if (selectedPoints?.includes(point.id)) {
      setSelectedPoints(selectedPoints.filter((p) => p !== point.id));
    } else {
      setSelectedPoints([...selectedPoints, point.id]);
    }
  }, [selectedPoints, setSelectedPoints]);

  // Use the reusable hook for nearest point click functionality
  useNearestPointClick({
    points,
    onPointClick: handlePointClick,
    maxDistanceMeters: 5000,
    enabled: true,
  });

  const sortedPoints = useMemo(
    () => sortPointsWithSelectionOrder(points, selectedPoints),
    [points, selectedPoints]
  );

  return (
    <>
      {sortedPoints.map((point) => (
        <PointItemCheckBox
          key={point.id}
          point={point}
          isSelected={selectedPoints.includes(point.id)}
          onMouseEnter={() => handleHoveredPoint(point)}
          onMouseLeave={handleRemoveHoverePoint}
          onCheckboxClick={(e) => {
            e.stopPropagation();
            handlePointClick(point);
          }}
          onItemClick={() => {
            setSelectedPoints([point.id]);
          }}
        />
      ))}
    </>
  );
}
