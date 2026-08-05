import type { PeriodType } from "hooks/filters/usePointsFilterStore";
import { useContent } from "hooks/useContent";

type PointsPeriodFilterFieldsProps = {
  periodFilter: PeriodType;
  setPeriodFilter: (value: PeriodType) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
};

/** Shared period / van-tot fields for points filter panels (TemplateFlight, etc.). */
export default function PointsPeriodFilterFields({
  periodFilter,
  setPeriodFilter,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: PointsPeriodFilterFieldsProps) {
  const content = useContent();
  const labels = content.common.filterSection;

  return (
    <>
      <div className="grid grid-cols-6 gap-x-2 items-center">
        <p className="col-span-2 labelClass">{labels.periode}:</p>
        <select
          className="inputClass col-span-4 !w-[75%] ml-auto"
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value as PeriodType)}
        >
          <option value="alle">{labels.Alle}</option>
          <option value="Laatste 4 weken">{labels.Laatste4weken}</option>
          <option value="Periodoe van-tot">{labels.PeriodeVanTot}</option>
        </select>
      </div>

      {periodFilter === "Periodoe van-tot" && (
        <>
          <div className="grid grid-cols-6 gap-x-2 items-center mt-2">
            <p className="col-span-2 labelClass">{labels.Periodevan}</p>
            <input
              className="inputClass col-span-4 !w-[75%] ml-auto"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-6 gap-x-2 items-center mt-2">
            <p className="col-span-2 labelClass">{labels.Periodetot}</p>
            <input
              className="inputClass col-span-4 !w-[75%] ml-auto"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </>
      )}
    </>
  );
}
