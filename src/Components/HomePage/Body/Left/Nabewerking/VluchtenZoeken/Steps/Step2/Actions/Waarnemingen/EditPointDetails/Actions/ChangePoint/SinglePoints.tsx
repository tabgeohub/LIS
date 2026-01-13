import usePointClick from "hooks/hover-click-handlers/usePointClick";
import usePointHover from "hooks/hover-click-handlers/usePointHover";
import useLogAction from "hooks/useLogAction";
import { EnrichedPointType } from "Types";
import PointItemCheckBox from "Components/HomePage/Body/Left/Common/PointItemCheckBox";

export default function SinglePoint({
  point,
  selectedPoint,
  setSelectedPoint,
}: {
  point: EnrichedPointType;
  selectedPoint: EnrichedPointType;
  setSelectedPoint: (value: EnrichedPointType) => void;
}) {
  const logAction = useLogAction();

  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();
  usePointClick([selectedPoint]);

  return (
    <PointItemCheckBox
      point={point}
      isSelected={selectedPoint?.id === point?.id}
      onMouseEnter={() => handleHoveredPoint(point)}
      onMouseLeave={handleRemoveHoverePoint}
      onItemClick={() => {
        setSelectedPoint(point);

        logAction({
          message: `User clicked on point ${point.omschrijving}`,
          step: "Second step - Change point",
        });
      }}
      showCheckbox={false}
      variant="compact"
    />
  );
}
