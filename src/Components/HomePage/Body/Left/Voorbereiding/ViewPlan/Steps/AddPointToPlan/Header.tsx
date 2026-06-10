import { EnrichedPointType } from "Types";
import PointsSelectionHeader from "Components/HomePage/Body/Common/ViewPlan/PointsSelectionHeader";

export default function Header({
  setSelectedPointIds,
  filteredPoints,
  filter,
  setFilter,
}: {
  setSelectedPointIds: (value: number[]) => void;
  filteredPoints: EnrichedPointType[];
  filter: string;
  setFilter: (value: string) => void;
}) {
  return (
    <PointsSelectionHeader
      onSelectAll={() => setSelectedPointIds(filteredPoints.map((pt) => pt.id))}
      onDeselectAll={() => setSelectedPointIds([])}
      filter={filter}
      setFilter={setFilter}
    />
  );
}
