/* eslint-disable react-hooks/exhaustive-deps */
import { EnrichedPointType } from "Types";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect, useMemo } from "react";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";
import useLogAction from "hooks/useLogAction";
import useDrawYellowMarkers from "hooks/hover-click-handlers/useDrawYellowMarkers";
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
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { setHovered } = useHoveredGraphicState();

  const logAction = useLogAction();

  function handlePointClick(point: EnrichedPointType) {
    if (selectedPoints?.includes(point.id)) {
      setSelectedPoints(selectedPoints.filter((p) => p !== point.id));
    } else {
      setSelectedPoints([...selectedPoints, point.id]);
    }
  }

  useEffect(() => {
    if (mapView && redGraphicsLayer) {
      mapView.on("click", async (event) => {
        event.stopPropagation();

        const hitTestResults = await mapView.hitTest(event);

        const existingFeature = hitTestResults.results.find(
          (result) => (result as __esri.GraphicHit).graphic
        );

        // @ts-ignore
        const point = existingFeature?.graphic.attributes;

        if (point) {
          handlePointClick(point);
        }
      });
    }
  }, [selectedPoints]);

  useDrawYellowMarkers({
    selectedPointIds: selectedPoints,
    points,
    onPointsDrawn: (selectedPointIds) => {
      const step = points.at(0)?.herhalen === 1 ? 2 : 3;

      logAction({
        message: "User is selecting points",
        step: `Step ${step}`,
        newData: {
          selectedPoints: selectedPointIds,
        },
      });
    },
  });

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
          onMouseEnter={() =>
            setHovered({
              id: point.id,
              label: point.omschrijving || "",
            })
          }
          onMouseLeave={() => setHovered(null)}
          onCheckboxClick={(e) => {
            e.stopPropagation();
            handlePointClick(point);
          }}
          onItemClick={() => {
            if (selectedPoints.length === 1 && selectedPoints[0] === point.id) {
              setSelectedPoints([]);
            } else {
              setSelectedPoints([point.id]);
            }
          }}
        />
      ))}
    </>
  );
}
