import usePointClick from "hooks/hover-click-handlers/usePointClick";
import usePointHover from "hooks/hover-click-handlers/usePointHover";
import useLogAction from "hooks/useLogAction";
import { FinishedPointType } from "Types/finished_plans";
import PointItemCheckBox from "Components/HomePage/Body/Left/Common/PointItemCheckBox";

export default function SinglePoint({
  point,
  selectedPoint,
  setSelectedPoint,
}: {
  point: FinishedPointType;
  selectedPoint: FinishedPointType;
  setSelectedPoint: (value: FinishedPointType) => void;
}) {
  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();
  // @ts-ignore
  usePointClick([selectedPoint]);

  const logAction = useLogAction();

  return (
    <PointItemCheckBox
      point={point}
      isSelected={selectedPoint?.id === point?.id}
      onMouseEnter={() => {
        // @ts-ignore
        handleHoveredPoint(point);
      }}
      onMouseLeave={handleRemoveHoverePoint}
      onItemClick={() => {
        setSelectedPoint(point);

        logAction({
          message: `User clicked on point ${point.omschrijving}`,
          step: "Second step - Edit point",
        });
      }}
      showCheckbox={false}
      variant="compact"
      showAttachments={true}
    />
  );
}
