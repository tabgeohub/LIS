import { useCallback } from "react";
import { EnrichedPointType } from "Types";
import PointItemCheckBox from "Components/HomePage/Body/Left/Common/PointItemCheckBox";
import usePointHover from "hooks/hover-click-handlers/usePointHover";
import {
  togglePointSelection,
  useMapPointSelectionClick,
} from "hooks/viewPlan/useMapPointSelectionClick";
import { useSortedPointSelection } from "hooks/viewPlan/useSortedPointSelection";

export default function PointsSelectionList({
  points,
  selectedPointIds,
  setSelectedPointIds,
  className = "overflow-auto border-t border-gray-200 h-full",
}: {
  points: EnrichedPointType[];
  selectedPointIds: number[];
  setSelectedPointIds: React.Dispatch<React.SetStateAction<number[]>>;
  className?: string;
}) {
  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();

  const handlePointClick = useCallback(
    (point: EnrichedPointType) => {
      togglePointSelection(point.id, setSelectedPointIds);
    },
    [setSelectedPointIds]
  );

  useMapPointSelectionClick({ onPointClick: handlePointClick });

  const sortedPoints = useSortedPointSelection(points, selectedPointIds);

  return (
    <div className={className}>
      {sortedPoints.map((pt) => (
        <PointItemCheckBox
          key={pt.id}
          point={pt}
          isSelected={selectedPointIds.includes(pt.id)}
          onMouseEnter={() => handleHoveredPoint(pt)}
          onMouseLeave={handleRemoveHoverePoint}
          onCheckboxClick={(e) => {
            e.stopPropagation();
            handlePointClick(pt);
          }}
          onItemClick={() => {
            handlePointClick(pt);
          }}
        />
      ))}
    </div>
  );
}
