import { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import SinglePoint from "./SinglePoint";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useContent } from "hooks/useContent";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { createDebouncedClickGuard } from "hooks/map/mapClickGuard";
import { sortPointsWithSelectedFirst } from "./sortDeletePoints";

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

    const clickGuard = createDebouncedClickGuard();

    const clickHandler = mapView.on("click", async (event) => {
      if (clickGuard.shouldSkip()) return;

      try {
        event.stopPropagation();
        const hitTestResults = await mapView.hitTest(event, {
          include: [pointsGraphicsLayer],
        });

        const pointAttributes = (
          hitTestResults.results.find(
            (result) => (result as __esri.GraphicHit).graphic
          ) as __esri.GraphicHit | undefined
        )?.graphic?.attributes;

        if (!pointAttributes?.id) return;

        const clickedPoint = pointsRef.current.find(
          (p) => p.id === pointAttributes.id
        );
        if (clickedPoint) setSelectedPointsRef.current([clickedPoint]);
      } catch (error) {
        console.error("Error handling map click:", error);
      } finally {
        clickGuard.finish();
      }
    });

    return () => clickHandler.remove();
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
