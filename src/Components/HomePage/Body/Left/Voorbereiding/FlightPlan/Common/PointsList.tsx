/* eslint-disable react-hooks/exhaustive-deps */
import { EnrichedPointType } from "Types";
import usePointHover from "hooks/hover-click-handlers/usePointHover";
import usePointClick from "hooks/hover-click-handlers/usePointClick";
import { useEffect, useMemo } from "react";
import useLogAction from "hooks/useLogAction";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { getDistanceMeters } from "@helpers/getDistanceMeters";
import PointItemCheckBox from "Components/HomePage/Body/Left/Common/PointItemCheckBox";

export default function PointsList({
  selectedPoints,
  setSelectedPoints,
  points,
}: {
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  points: EnrichedPointType[];
}) {
  const logAction = useLogAction();
  const { mapView, redGraphicsLayer } = useMapViewState();

  usePointClick(points.filter((point) => selectedPoints.includes(point.id)));
  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();


  useEffect(() => {
    const step = points.at(0)?.herhalen === 1 ? 2 : 3;

    logAction({
      message: `User is selecting points`,
      step: `Step ${step}`,
      newData: {
        selectedPoints: selectedPoints,
      },
    });
  }, [selectedPoints]);

  function handlePointClick(point: EnrichedPointType) {
    if (selectedPoints?.includes(point.id)) {
      setSelectedPoints(selectedPoints.filter((p) => p !== point.id));
    } else {
      setSelectedPoints([...selectedPoints, point.id]);
    }
  }

  // Register map click handler - always finds nearest point to click location
  useEffect(() => {
    if (mapView && redGraphicsLayer) {
      const clickHandler = mapView.on("click", async (event) => {
        event.stopPropagation();

        const { mapPoint } = event;
        if (!mapPoint) return;

        const clickedLat = Number(mapPoint.latitude);
        const clickedLon = Number(mapPoint.longitude);

        // Find the nearest point to the clicked location
        // Use a reasonable maximum distance to avoid selecting points that are too far away
        const MAX_DISTANCE_M = 5000; // 500 meters maximum
        let nearestPoint: EnrichedPointType | null = null;
        let minDistance = Infinity;

        // Check all points and find the nearest one
        for (const point of points) {
          if (!point.latitude || !point.longitude) continue;

          const distance = getDistanceMeters(
            point.latitude,
            point.longitude,
            clickedLat,
            clickedLon
          );

          // Always track the nearest point, but only select if within reasonable distance
          if (distance < minDistance) {
            minDistance = distance;
            if (distance <= MAX_DISTANCE_M) {
              nearestPoint = point;
            }
          }
        }

        // Select the nearest point if found within reasonable distance
        if (nearestPoint) {
          handlePointClick(nearestPoint);
        }
      });

      // Cleanup to prevent memory leaks
      return () => {
        clickHandler.remove();
      };
    }
  }, [selectedPoints, mapView, redGraphicsLayer, points]);

  const sortedPoints = useMemo(() => {
    const indexMap = new Map<number, number>();
    points.forEach((p, i) => indexMap.set(p.id, i));

    // Create reverse index map for selected points (last clicked = 0, first clicked = highest)
    const selectedReverseIndexMap = new Map<number, number>();
    selectedPoints.forEach((id, i) => {
      selectedReverseIndexMap.set(id, selectedPoints.length - 1 - i);
    });

    const isSelected = (id: number) => (selectedPoints.includes(id) ? 0 : 1);
    return [...points].sort((a, b) => {
      const selOrder = isSelected(a.id) - isSelected(b.id);
      if (selOrder !== 0) return selOrder;

      // For selected points, sort by reverse index (last clicked first)
      if (selectedPoints.includes(a.id) && selectedPoints.includes(b.id)) {
        const aReverseIndex = selectedReverseIndexMap.get(a.id) ?? 0;
        const bReverseIndex = selectedReverseIndexMap.get(b.id) ?? 0;
        return aReverseIndex - bReverseIndex;
      }

      // For non-selected points, maintain original order
      return (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0);
    });
  }, [points, selectedPoints]);

  return (
    <>
      {sortedPoints.map((point) => (
        <PointItemCheckBox
          key={point.id}
          point={point}
          isSelected={selectedPoints.includes(point.id)}
          onMouseEnter={() => handleHoveredPoint(point)}
          onMouseLeave={handleRemoveHoverePoint}
          onCheckboxClick={(e) => {
            e.stopPropagation();
            handlePointClick(point);
          }}
          onItemClick={() => {
            setSelectedPoints([point.id]);
          }}
        />
      ))}
    </>
  );
}
