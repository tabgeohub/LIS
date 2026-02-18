import { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import SinglePoint from "./SinglePoint";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useContent } from "hooks/useContent";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";

export default function Main() {
  const { points } = usePointsStore();
  const { mapView, pointsGraphicsLayer } = useMapViewState();
  const { selectedPoints, setSelectedPoints } = useDeletePointState();

  const [filterTerm, setFilterTerm] = useState("");

  const content = useContent();

  // Use refs to avoid recreating the click handler on every points change
  const pointsRef = useRef(points);
  const setSelectedPointsRef = useRef(setSelectedPoints);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    setSelectedPointsRef.current = setSelectedPoints;
  }, [setSelectedPoints]);

  // Handle map click to select point
  useEffect(() => {
    if (!mapView || !pointsGraphicsLayer) return;

    let isProcessing = false;
    let lastClickTime = 0;
    const DEBOUNCE_MS = 150; // Debounce rapid clicks

    const clickHandler = mapView.on("click", async (event) => {
      // Debounce rapid clicks
      const now = Date.now();
      if (now - lastClickTime < DEBOUNCE_MS) {
        return;
      }
      lastClickTime = now;

      // Prevent multiple simultaneous clicks
      if (isProcessing) {
        return;
      }
      isProcessing = true;

      try {
        event.stopPropagation();

        // Optimize hitTest to only check pointsGraphicsLayer
        const hitTestResults = await mapView.hitTest(event, {
          include: [pointsGraphicsLayer],
        });

        const existingFeature = hitTestResults.results.find(
          (result) => (result as __esri.GraphicHit).graphic
        );

        // @ts-ignore
        const pointAttributes = existingFeature?.graphic?.attributes;

        if (pointAttributes && pointAttributes.id) {
          // Find the full point object using ref
          const clickedPoint = pointsRef.current.find(
            (p) => p.id === pointAttributes.id
          );

          if (clickedPoint) {
            // Select only this point (single selection)
            setSelectedPointsRef.current([clickedPoint]);
          }
        }
      } catch (error) {
        console.error("Error handling map click:", error);
      } finally {
        isProcessing = false;
      }
    });

    return () => {
      clickHandler.remove();
    };
  }, [mapView, pointsGraphicsLayer]);

  // Sort points: selected point at top, then others
  const sortedPoints = useMemo(() => {
    const filtered = points.filter((point) =>
      point.omschrijving.toLowerCase().includes(filterTerm.toLowerCase())
    );

    const selectedPointId =
      selectedPoints.length === 1 ? selectedPoints[0]?.id : null;

    if (!selectedPointId) {
      return filtered;
    }

    const selectedPoint = filtered.find((p) => p.id === selectedPointId);
    const otherPoints = filtered.filter((p) => p.id !== selectedPointId);

    return selectedPoint ? [selectedPoint, ...otherPoints] : filtered;
  }, [points, filterTerm, selectedPoints]);

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
