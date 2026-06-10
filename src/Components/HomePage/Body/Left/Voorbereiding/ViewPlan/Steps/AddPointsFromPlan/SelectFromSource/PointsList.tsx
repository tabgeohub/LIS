import { useMemo, useState } from "react";
import { EnrichedPointType } from "Types";
import { usePointsStore } from "hooks/features/usePointsStore";
import PointsSelectionHeader from "Components/HomePage/Body/Common/ViewPlan/PointsSelectionHeader";
import PointsSelectionList from "Components/HomePage/Body/Common/ViewPlan/PointsSelectionList";

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
  const { dbPoints } = usePointsStore();

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

  return (
    <div className="h-[90%] flex flex-col">
      <PointsSelectionHeader
        onSelectAll={() =>
          setSelectedPointIds(() => selectedItem.points.map((pt) => pt.id))
        }
        onDeselectAll={() => setSelectedPointIds(() => [])}
        filter={filter}
        setFilter={setFilter}
      />

      <PointsSelectionList
        points={points}
        selectedPointIds={selectedPointIds}
        setSelectedPointIds={setSelectedPointIds}
      />
    </div>
  );
}
