/* eslint-disable react-hooks/exhaustive-deps */
import { EnrichedPointType } from "Types";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect, useMemo, useState, useCallback } from "react";
import { createPin } from "@helpers/ArcGISHelpers/createPin";
import useLogAction from "hooks/useLogAction";
import useDrawYellowMarkers from "hooks/hover-click-handlers/useDrawYellowMarkers";
import useNearestPointClick from "hooks/hover-click-handlers/useNearestPointClick";
import { useContent } from "hooks/useContent";
import PointItemCheckBox from "Components/HomePage/Body/Left/Common/PointItemCheckBox";

export default function PointsList({
  selectedPoints,
  setSelectedPoints,
  points,
  step,
  hideHeader,
}: {
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  points: EnrichedPointType[];
  step: number;
  hideHeader?: boolean;
}) {
  const [searchedPoints, setSearchedPoints] =
    useState<EnrichedPointType[]>(points);
  const [filterText, setFilterText] = useState("");

  const { mapView, redGraphicsLayer } = useMapViewState();
  const logAction = useLogAction();

  const content = useContent();

  function handleHoveredPoint(point: EnrichedPointType) {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();
    graphicsArray
      .filter((g) => g.attributes?.label === "hovered-point")
      .forEach((g) => mapView.graphics.remove(g));

    createPin(point, mapView, "hovered-point");
  }

  function handleRemoveHoverePoint() {
    if (!mapView) return;

    const graphicsArray = mapView.graphics.toArray();
    graphicsArray
      .filter((g) => g.attributes?.label === "hovered-point")
      .forEach((g) => mapView.graphics.remove(g));
  }

  useDrawYellowMarkers({
    selectedPointIds: selectedPoints,
    points,
    onPointsDrawn: (selectedPointIds) => {
      const step = points.at(0)?.herhalen === 1 ? 2 : 3;

      logAction({
        message: "User is selecting points",
        step: `Step ${step}`,
        newData: { selectedPoints: selectedPointIds },
      });
    },
  });

  useEffect(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) {
      setSearchedPoints(points);
    } else {
      setSearchedPoints(
        points.filter((p) => (p.omschrijving ?? "").toLowerCase().includes(q))
      );
    }
  }, [filterText, points]);

  const handlePointClick = useCallback((point: EnrichedPointType) => {
    if (selectedPoints?.includes(point.id)) {
      setSelectedPoints(selectedPoints.filter((p) => p !== point.id));
    } else {
      setSelectedPoints([...selectedPoints, point.id]);
    }
  }, [selectedPoints, setSelectedPoints]);

  // Use the reusable hook for nearest point click functionality
  useNearestPointClick({
    points,
    onPointClick: handlePointClick,
    maxDistanceMeters: 5000,
    enabled: true,
  });

  const sortedPoints = useMemo(() => {
    const indexMap = new Map<number, number>();
    searchedPoints.forEach((p, i) => indexMap.set(p.id, i));

    // Create reverse index map for selected points (last clicked = 0, first clicked = highest)
    const selectedReverseIndexMap = new Map<number, number>();
    selectedPoints.forEach((id, i) => {
      selectedReverseIndexMap.set(id, selectedPoints.length - 1 - i);
    });

    const isSelected = (id: number) => (selectedPoints.includes(id) ? 0 : 1);
    return [...searchedPoints].sort((a, b) => {
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
  }, [searchedPoints, selectedPoints]);

  return (
    <>
      {!hideHeader && (
        <>
          <p className="text-gray-800 leading-3 text-[10px] p-3">
            {step === 2
              ? content.voorbereiding.vluchtenTemplate.step2.text
              : content.voorbereiding.vluchtenTemplate.step3.text}
          </p>

          <input
            type="text"
            placeholder="Filter resultaten"
            className="inputClass !rounded-lg !px-2 !py-0 !pb-0.5 placeholder:text-[10px]"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </>
      )}

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
            handlePointClick(point);
          }}
        />
      ))}
    </>
  );
}
