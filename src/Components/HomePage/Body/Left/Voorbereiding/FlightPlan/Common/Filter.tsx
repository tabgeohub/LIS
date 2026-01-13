import {
  PeriodType,
  usePointsFilterStore,
} from "hooks/filters/usePointsFilterStore";
import { EnrichedPointType } from "Types";
import { useFilterPoints } from "hooks/filters/useFilterPoints";
import SelectComp from "../../../Common/FormComponents/SelectComp";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import { useContent } from "hooks/useContent";

export default function Filter({
  setOpenFilter,
  herhalen,
  setFilteredPoints,
}: {
  setOpenFilter: (value: boolean) => void;
  herhalen: boolean;
  setFilteredPoints: (value: EnrichedPointType[]) => void;
}) {
  const activities = useGetActiviteiten();

  const content = useContent();

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
        label={content.common.filterSection.activiteit}
        value={activityFilter}
        setValue={(value) => setActivityFilter(value)}
        options={activities}
      />

      <SelectComp
        label="Periode"
        value={periodFilter}
        setValue={(value) => setPeriodFilter(value as PeriodType)}
        options={[
          { label: content.common.filterSection.Alle, value: "Alle" },
          {
            label: content.common.filterSection.Laatste4weken,
            value: "Laatste 4 weken",
          },
          {
            label: content.common.filterSection.PeriodeVanTot,
            value: "Periodoe van-tot",
          },
        ]}
      />

      {periodFilter === "Periodoe van-tot" && (
        <>
          <div className="grid grid-cols-6 gap-x-2 items-center">
            <p className="col-span-2 labelClass">
              {content.common.filterSection.Periodevan}
            </p>
            <input
              className="inputClass col-span-4 !w-[75%]"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-6 gap-x-2 items-center">
            <p className="col-span-2 labelClass">
              {content.common.filterSection.Periodetot}
            </p>
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
