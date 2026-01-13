/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect, useMemo } from "react";
import { EnrichedPointType } from "Types";
import PointItemCheckBox from "Components/HomePage/Body/Left/Common/PointItemCheckBox";
import usePointHover from "hooks/hover-click-handlers/usePointHover";

export default function PointsList({
  filteredPoints,
  filter,
  selectedPointIds,
  setSelectedPointIds,
}: {
  filteredPoints: EnrichedPointType[];
  filter: string;
  selectedPointIds: number[];
  setSelectedPointIds: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();

  const points = useMemo(() => {
    return filteredPoints.filter((pt) =>
      pt.omschrijving.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filteredPoints, filter]);

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
  );
}
