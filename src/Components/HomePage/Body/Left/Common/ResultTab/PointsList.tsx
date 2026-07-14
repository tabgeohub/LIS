import { EnrichedPointType } from "Types";
import ResultTabPointsListFrame from "./ResultTabPointsListFrame";

export default function PointsList({
  clickedPoint,
  setFase,
  setClickedPoint,
}: {
  clickedPoint: EnrichedPointType | undefined;
  setFase: (value: string) => void;
  setClickedPoint: (value: EnrichedPointType | undefined) => void;
}) {
  return (
    <ResultTabPointsListFrame
      clickedPoint={clickedPoint}
      setClickedPoint={setClickedPoint}
      setFase={setFase}
      summaryText="Weergeven resultaat {start} - {end} (Totaal: {total})"
      pageInfoText="Pagina {current} van {totalPages}"
    />
  );
}
