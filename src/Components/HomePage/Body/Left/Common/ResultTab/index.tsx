import { useState } from "react";
import PointsList from "./PointsList";
import PointDetails from "./PointDetails";
import { EnrichedPointType } from "Types";
import PointListBuffer from "./PointListBuffer";
import PointsListEdit from "./PointsListEdit";

export default function ResultTab() {
  const [fase, setFase] = useState<string>("list");
  const [clickedPoint, setClickedPoint] = useState<
    EnrichedPointType | undefined
  >();

  return (
    <div>
      {fase === "list" && (
        <PointsList
          clickedPoint={clickedPoint}
          setFase={setFase}
          setClickedPoint={setClickedPoint}
        />
      )}

      {fase === "details" && (
        <PointDetails setFase={setFase} clickedPoint={clickedPoint} />
      )}

      {fase === "buffer" && <PointListBuffer setFase={setFase} />}

      {fase === "listPoints" && (
        <PointsListEdit
          clickedPoint={clickedPoint}
          setFase={setFase}
          setClickedPointDetails={setClickedPoint}
        />
      )}
    </div>
  );
}
