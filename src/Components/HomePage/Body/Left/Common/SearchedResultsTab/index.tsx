/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import SearchedResults from "./SearchedResults";
import FlightPlans from "./FlightPlans";
import { useReadData } from "utils/useReadData";
import { useSearchKeyword } from "@helpers/ZustandStates/searchKeyword";
import { EnrichedPointType, FlightPlanType } from "Types";
import PointsBuffer from "./Functions/PointsBuffer";
import PointDetails from "./Points/PointDetails";
import Points from "./Points";
import AddPoint from "./Functions/AddPoint";
import { usePointsStore } from "hooks/features/usePointsStore";

export default function SearchedResultsTab() {
  const [fase, setFase] = useState<string>("all");
  const [target, setTarget] = useState<string>("");
  const [clickedPoint, setClickedPoint] = useState<
    EnrichedPointType | undefined
  >();
  const [uniquePointsData, setUniquePointsData] =
    useState<EnrichedPointType[]>();
  const [uniqueFlightPlansDats, setUniqueFlightPlansDats] =
    useState<FlightPlanType[]>();

  const { searchKeyword } = useSearchKeyword();

  const { data: flightPlansData } = useReadData<FlightPlanType[]>(
    `/flightPlans/searchedFlightplan?search=${searchKeyword}`
  );

  const { data: pointsData } = useReadData<EnrichedPointType[]>(
    `/points/searchedPoints/${searchKeyword}`
  );

  const { setPoints } = usePointsStore();

  useEffect(() => {
    if (!pointsData) return;
    setUniquePointsData(
      Array.from(new Map(pointsData.map((p) => [p.id, p])).values())
    );
    if (!flightPlansData) return;
    setUniqueFlightPlansDats(
      Array.from(new Map(flightPlansData.map((p) => [p.id, p])).values())
    );
    setPoints(pointsData);
  }, [pointsData, flightPlansData]);

  if (!uniqueFlightPlansDats || !uniquePointsData) return null;

  return (
    <div>
      {fase === "all" && (
        <SearchedResults
          setFase={setFase}
          flightPlansData={uniqueFlightPlansDats!}
          pointsData={uniquePointsData!}
          setTarget={setTarget}
        />
      )}

      {fase === "flightPlans" && (
        <FlightPlans
          setFase={setFase}
          flightPlansData={uniqueFlightPlansDats}
        />
      )}

      {fase === "details" && (
        <PointDetails setFase={setFase} clickedPoint={clickedPoint} />
      )}

      {fase === "points" && (
        <Points
          clickedPoint={clickedPoint}
          setFase={setFase}
          pointsData={uniquePointsData}
          setClickedPointDetails={setClickedPoint}
        />
      )}

      {fase === "buffer" && (
        <PointsBuffer
          setFase={setFase}
          target={target}
          pointsData={uniquePointsData}
          flightPlansData={uniqueFlightPlansDats}
        />
      )}

      {fase === "addPoint" && (
        <AddPoint
          setFase={setFase}
          flightPlansData={uniqueFlightPlansDats}
          pointsData={uniquePointsData}
        />
      )}
    </div>
  );
}
