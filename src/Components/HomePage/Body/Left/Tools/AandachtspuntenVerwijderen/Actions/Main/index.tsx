import { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import SinglePoint from "./SinglePoint";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useContent } from "hooks/useContent";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { sortPointsWithSelectedFirst } from "./sortDeletePoints";
import { attachDeletePointMapClick } from "./attachDeletePointMapClick";

export default function Main() {
  const { points } = usePointsStore();
  const { mapView, pointsGraphicsLayer } = useMapViewState();
  const { selectedPoints, setSelectedPoints } = useDeletePointState();
  const [filterTerm, setFilterTerm] = useState("");
  const content = useContent();

  const pointsRef = useRef(points);
  const setSelectedPointsRef = useRef(setSelectedPoints);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    setSelectedPointsRef.current = setSelectedPoints;
  }, [setSelectedPoints]);

  useEffect(() => {
    if (!mapView || !pointsGraphicsLayer) return;
    return attachDeletePointMapClick({
      mapView,
      pointsGraphicsLayer,
      getPoints: () => pointsRef.current,
      setSelectedPoints: (next) => setSelectedPointsRef.current(next),
    });
  }, [mapView, pointsGraphicsLayer]);

  const sortedPoints = useMemo(
    () =>
      sortPointsWithSelectedFirst({
        points,
        filterTerm,
        selectedPoints,
      }),
    [points, filterTerm, selectedPoints]
  );

  return (
    <>
      <Header setFilterTerm={setFilterTerm} />

      <ScrollButtonsLayout className="h-[75%]" buttons={<Buttons />}>
        <div className="pb-40">
          {points?.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-gray-400 text-[12px]">
                {content.tools.aandachtspuntenVerwijderen.pointsList.noPoints}{" "}
              </p>
            </div>
          )}

          {sortedPoints.map((point) => (
            <SinglePoint key={point.id} point={point} />
          ))}
        </div>
      </ScrollButtonsLayout>
    </>
  );
}
