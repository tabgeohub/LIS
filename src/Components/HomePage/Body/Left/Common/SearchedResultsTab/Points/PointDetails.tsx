import PointDetailsPanel from "Components/HomePage/Body/Left/Common/PointDetailsPanel";
import { EnrichedPointType } from "Types";

export default function PointDetails({
  setFase,
  clickedPoint,
}: {
  setFase: (value: string) => void;
  clickedPoint: EnrichedPointType | undefined;
}) {
  return (
    <PointDetailsPanel
      clickedPoint={clickedPoint}
      onBack={() => setFase("points")}
    />
  );
}
