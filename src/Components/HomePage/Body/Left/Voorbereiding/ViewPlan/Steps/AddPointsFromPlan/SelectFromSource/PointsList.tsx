/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useContent } from "hooks/useContent";
import { EnrichedPointType } from "Types";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import PointItemCheckBox from "Components/HomePage/Body/Left/Common/PointItemCheckBox";
import usePointHover from "hooks/hover-click-handlers/usePointHover";
import { usePointsStore } from "hooks/features/usePointsStore";

type Point = { id: number; omschrijving: string };
type ItemModel = { id: number; title: string; points: Point[] };

export default function PointsList({
  selectedItem,
  selectedPointIds,
  setSelectedPointIds,
}: {
  selectedItem: ItemModel;
  selectedPointIds: number[];
  setSelectedPointIds: (updater: (prev: number[]) => number[]) => void;
}) {
  const [filter, setFilter] = useState("");
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { dbPoints } = usePointsStore();
  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();
  const content = useContent();

  // Enrich simplified points with full point data from dbPoints
  const enrichedPoints = useMemo(() => {
    return selectedItem.points
      .map((pt) => dbPoints.find((dbPt) => dbPt.id === pt.id))
      .filter((pt): pt is EnrichedPointType => pt !== undefined);
  }, [selectedItem.points, dbPoints]);

  const points = useMemo(() => {
    return enrichedPoints.filter((pt) =>
      pt.omschrijving.toLowerCase().includes(filter.toLowerCase())
    );
  }, [enrichedPoints, filter]);

  function handlePointClick(point: EnrichedPointType) {
    setSelectedPointIds((prev) =>
      prev.includes(point.id)
        ? prev.filter((id) => id !== point.id)
        : [...prev, point.id]
    );
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
  }, [selectedPointIds]);

  const sortedPoints = useMemo(() => {
    const indexMap = new Map<number, number>();
    points.forEach((p, i) => indexMap.set(p.id, i));

    // Create reverse index map for selected points (last clicked = 0, first clicked = highest)
    const selectedReverseIndexMap = new Map<number, number>();
    selectedPointIds.forEach((id, i) => {
      selectedReverseIndexMap.set(id, selectedPointIds.length - 1 - i);
    });

    const isSelected = (id: number) => (selectedPointIds.includes(id) ? 0 : 1);
    return [...points].sort((a, b) => {
      const selOrder = isSelected(a.id) - isSelected(b.id);
      if (selOrder !== 0) return selOrder;
      
      // For selected points, sort by reverse index (last clicked first)
      if (selectedPointIds.includes(a.id) && selectedPointIds.includes(b.id)) {
        const aReverseIndex = selectedReverseIndexMap.get(a.id) ?? 0;
        const bReverseIndex = selectedReverseIndexMap.get(b.id) ?? 0;
        return aReverseIndex - bReverseIndex;
      }
      
      // For non-selected points, maintain original order
      return (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0);
    });
  }, [points, selectedPointIds]);

  return (
    <div className="h-[90%] flex flex-col">
      <div className="flex gap-x-2 pl-2">
        <button
          className="text-primary text-xs font-semibold"
          onClick={() =>
            setSelectedPointIds(() => selectedItem.points.map((pt) => pt.id))
          }
        >
          Selecteer alle
        </button>

        <span className="text-gray-500 text-xs font-semibold">|</span>

        <button
          className="text-primary text-xs font-semibold"
          onClick={() => setSelectedPointIds(() => [])}
        >
          Deselecteer alle
        </button>
      </div>

      <div className="px-1.5 mt-1 mb-2">
        <input
          type="text"
          placeholder={
            content.voorbereiding.addPointsFromPlan.placeholders.filterPoints
          }
          className="inputClass"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="overflow-auto border-t border-gray-200 h-full">
        {sortedPoints.map((pt) => (
          <PointItemCheckBox
            key={pt.id}
            point={pt}
            isSelected={selectedPointIds.includes(pt.id)}
            onMouseEnter={() => handleHoveredPoint(pt)}
            onMouseLeave={handleRemoveHoverePoint}
            onCheckboxClick={(e) => {
              e.stopPropagation();
              handlePointClick(pt);
            }}
            onItemClick={() => {
              handlePointClick(pt);
            }}
          />
        ))}
      </div>
    </div>
  );
}
