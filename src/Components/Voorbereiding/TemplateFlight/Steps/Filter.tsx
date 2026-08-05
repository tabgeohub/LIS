import { useFilterPoints } from "hooks/filters/useFilterPoints";
import {
  PeriodType,
  usePointsFilterStore,
} from "hooks/filters/usePointsFilterStore";
import { useContent } from "hooks/useContent";
import { EnrichedPointType } from "Types";

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
      <div className="grid grid-cols-6 gap-x-2 items-center">
        <p className="col-span-2 labelClass">
          {content.common.filterSection.periode}:
        </p>

        <select
          className="inputClass col-span-4 !w-[75%] ml-auto"
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value as PeriodType)}
        >
          <option value="alle">{content.common.filterSection.Alle}</option>
          <option value="Laatste 4 weken">
            {content.common.filterSection.Laatste4weken}
          </option>
          <option value="Periodoe van-tot">
            {content.common.filterSection.PeriodeVanTot}
          </option>
        </select>
      </div>

      {periodFilter === "Periodoe van-tot" && (
        <>
          <div className="grid grid-cols-6 gap-x-2 items-center mt-2">
            <p className="col-span-2 labelClass">
              {content.common.filterSection.Periodevan}
            </p>

            <input
              className="inputClass col-span-4 !w-[75%] ml-auto"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-6 gap-x-2 items-center mt-2">
            <p className="col-span-2 labelClass">
              {content.common.filterSection.Periodetot}
            </p>

            <input
              className="inputClass col-span-4 !w-[75%] ml-auto"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="flex gap-x-2 text-xs justify-end mt-4">
        <button
          onClick={() => {
            setOpenFilter(false);

            filterPoints(herhalen, setFilteredPoints);
          }}
          className="gray-button"
        >
          {content.common.filteren}
        </button>

        <button onClick={() => setOpenFilter(false)} className="gray-button">
          {content.common.annuleren}
        </button>
      </div>
    </div>
  );
}
