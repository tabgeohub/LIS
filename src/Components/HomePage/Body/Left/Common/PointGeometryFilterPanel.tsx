import SelectComp from "./FormComponents/SelectComp";
import { useConstSelectOptions } from "Components/HomePage/hooks/consts/useConstSelectOptions";
import { useFilterGeometries } from "Components/HomePage/hooks/filters/useFilterGeometries";
import { useFilterPoints } from "Components/HomePage/hooks/filters/useFilterPoints";
import {
  type PeriodType,
  usePointsFilterStore,
} from "Components/HomePage/hooks/filters/usePointsFilterStore";
import type { Geometry } from "hooks/features/useGeometriesStore";
import type { EnrichedPointType } from "Types";

export type PointGeometryFilterLabels = {
  activity: string;
  all: string;
  lastFourWeeks: string;
  customPeriod: string;
  dateFrom: string;
  dateTo: string;
  apply: string;
  cancel: string;
};

export default function PointGeometryFilterPanel({
  setOpenFilter,
  setFilteredPoints,
  setFilteredGeometries,
  herhalen,
  labels,
  closeBeforeFilter = false,
}: {
  setOpenFilter: (value: boolean) => void;
  setFilteredPoints: (value: EnrichedPointType[]) => void;
  setFilteredGeometries?: (value: Geometry[]) => void;
  herhalen: boolean;
  labels: PointGeometryFilterLabels;
  closeBeforeFilter?: boolean;
}) {
  const activities = useConstSelectOptions("activiteiten");
  const filterPoints = useFilterPoints();
  const filterGeometries = useFilterGeometries();
  const store = usePointsFilterStore();

  function applyFilter() {
    if (closeBeforeFilter) setOpenFilter(false);
    filterPoints(herhalen, setFilteredPoints);
    if (setFilteredGeometries) {
      filterGeometries(herhalen, setFilteredGeometries);
    }
    if (!closeBeforeFilter) setOpenFilter(false);
  }

  return (
    <div className="flex flex-col gap-y-2">
      <SelectComp
        label={labels.activity}
        value={store.activityFilter}
        setValue={store.setActivityFilter}
        options={activities}
      />
      <SelectComp
        label="Periode"
        value={store.periodFilter}
        setValue={(value) => store.setPeriodFilter(value as PeriodType)}
        options={[
          { label: labels.all, value: "Alle" },
          { label: labels.lastFourWeeks, value: "Laatste 4 weken" },
          { label: labels.customPeriod, value: "Periodoe van-tot" },
        ]}
      />

      {store.periodFilter === "Periodoe van-tot" && (
        <>
          <DateFilterInput
            label={labels.dateFrom}
            value={store.dateFrom}
            setValue={store.setDateFrom}
          />
          <DateFilterInput
            label={labels.dateTo}
            value={store.dateTo}
            setValue={store.setDateTo}
          />
        </>
      )}

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button onClick={applyFilter} className="gray-button">
          {labels.apply}
        </button>
        <button onClick={() => setOpenFilter(false)} className="gray-button">
          {labels.cancel}
        </button>
      </div>
    </div>
  );
}

function DateFilterInput({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-x-2 items-center">
      <p className="col-span-2 labelClass">{label}</p>
      <input
        className="inputClass col-span-4 !w-[75%]"
        type="date"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
