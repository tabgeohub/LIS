import { useMemo } from "react";
import { EnrichedPointType } from "Types";
import PointsSelectionList from "Components/HomePage/Body/Common/ViewPlan/PointsSelectionList";

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
  const points = useMemo(() => {
    return filteredPoints.filter((pt) =>
      pt.omschrijving.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filteredPoints, filter]);

  return (
    <PointsSelectionList
      points={points}
      selectedPointIds={selectedPointIds}
      setSelectedPointIds={setSelectedPointIds}
    />
  );
}
