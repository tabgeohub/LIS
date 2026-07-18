import PointDetailsPanel from "Components/HomePage/Body/Left/Common/PointDetailsPanel";
import useLogAction from "hooks/useLogAction";
import { EnrichedPointType } from "Types";

export default function PointDetails({
  setFase,
  clickedPoint,
}: {
  setFase: (value: string) => void;
  clickedPoint: EnrichedPointType | undefined;
}) {
  const logAction = useLogAction();

  return (
    <PointDetailsPanel
      clickedPoint={clickedPoint}
      onBack={() => {
        setFase("list");
        logAction({
          message: `User clicked on back arrow`,
          step: "ResultTab - PointDe  ",
        });
      }}
      onDetailsToggle={() => {
        logAction({
          message: `User clicked on 'Details' icon button`,
          step: "ResultTab - PointDetails",
        });
      }}
    />
  );
}
