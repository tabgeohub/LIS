import {
  PeriodType,
  usePointsFilterStore,
} from "hooks/filters/usePointsFilterStore";
import { EnrichedPointType } from "Types";
import { useFilterPoints } from "hooks/filters/useFilterPoints";
import SelectComp from "../../../Common/FormComponents/SelectComp";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";

export default function Filter({
  setOpenFilter,
  setFilteredPoints,
  herhalen,
}: {
  setOpenFilter: (value: boolean) => void;
  setFilteredPoints: (value: EnrichedPointType[]) => void;
  herhalen: boolean;
}) {
  const activities = useGetActiviteiten();

  const {
    activityFilter,
    periodFilter,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    setActivityFilter,
    setPeriodFilter,
  } = usePointsFilterStore();

  const filterPoints = useFilterPoints();

  return (
    <div className="flex flex-col gap-y-2">
      <SelectComp
        label="Activiteit"
        value={activityFilter}
        setValue={(value) => setActivityFilter(value)}
        options={activities}
      />

      <SelectComp
        label="Periode"
        value={periodFilter}
        setValue={(value) => setPeriodFilter(value as PeriodType)}
        options={[
          { label: "Alle", value: "Alle" },
          { label: "Laatste 4 weken", value: "Laatste 4 weken" },
          { label: "Periodoe van-tot", value: "Periodoe van-tot" },
        ]}
      />

      {periodFilter === "Periodoe van-tot" && (
        <>
          <div className="grid grid-cols-6 gap-x-2 items-center">
            <p className="col-span-2 labelClass">Periode van</p>
            <input
              className="inputClass col-span-4 !w-[75%]"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-6 gap-x-2 items-center">
            <p className="col-span-2 labelClass">Periode tot</p>
            <input
              className="inputClass col-span-4 !w-[75%]"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button
          onClick={() => {
            filterPoints(herhalen, setFilteredPoints);
            setOpenFilter(false);
          }}
          className="gray-button"
        >
          Filter
        </button>

        <button onClick={() => setOpenFilter(false)} className="gray-button">
          Annuleren
        </button>
      </div>
    </div>
  );
}
