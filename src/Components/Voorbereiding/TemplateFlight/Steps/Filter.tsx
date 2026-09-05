import { useFilterPoints } from "hooks/filters/useFilterPoints";
import { usePointsFilterStore } from "hooks/filters/usePointsFilterStore";
import { useContent } from "hooks/useContent";
import { EnrichedPointType } from "Types";
import PointsPeriodFilterFields from "Components/Common/PointsPeriodFilterFields";

export default function Filter({
  setOpenFilter,
  herhalen,
  setFilteredPoints,
}: {
  setOpenFilter: (value: boolean) => void;
  herhalen: boolean;
  setFilteredPoints: (value: EnrichedPointType[]) => void;
}) {
  const {
    periodFilter,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    setPeriodFilter,
  } = usePointsFilterStore();
  const content = useContent();
  const filterPoints = useFilterPoints();

  return (
    <div className="p-1.5 h-full">
      <PointsPeriodFilterFields
        periodFilter={periodFilter}
        setPeriodFilter={setPeriodFilter}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />

      <div className="flex gap-x-2 text-xs justify-end mt-4">
        <button
          type="button"
          onClick={() => {
            setOpenFilter(false);
            filterPoints(herhalen, setFilteredPoints);
          }}
          className="gray-button"
        >
          {content.common.filteren}
        </button>
        <button
          type="button"
          onClick={() => setOpenFilter(false)}
          className="gray-button"
        >
          {content.common.annuleren}
        </button>
      </div>
    </div>
  );
}
