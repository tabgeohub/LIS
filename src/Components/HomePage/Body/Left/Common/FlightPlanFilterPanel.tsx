import { useFilterPlans } from "Components/HomePage/hooks/filters/useFilterPlans";
import type { PeriodType } from "Components/HomePage/hooks/filters/usePlansFilterStore";
import { useContent } from "hooks/useContent";
import type { FlightPlanType } from "Types";

type FlightPlanFilterPanelProps = {
  plans: FlightPlanType[];
  filterText: string;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  periodFilter: PeriodType;
  setPeriodFilter: (value: PeriodType) => void;
  setOpenFilter: (value: boolean) => void;
  setFilteredPlans: (value: FlightPlanType[]) => void;
};

export default function FlightPlanFilterPanel(props: FlightPlanFilterPanelProps) {
  const filterPlans = useFilterPlans();
  const content = useContent();

  const applyFilter = () => {
    props.setOpenFilter(false);
    filterPlans({
      setFilteredPlans: props.setFilteredPlans,
      plans: props.plans,
      filterText: props.filterText,
      dateFrom: props.dateFrom,
      dateTo: props.dateTo,
      periodFilter: props.periodFilter,
    });
  };

  return (
    <div className="p-1.5">
      <div className="grid grid-cols-6 gap-x-2 items-center">
        <p className="col-span-2 labelClass">{content.common.filterSection.periode}:</p>
        <select
          className="inputClass col-span-4 !w-[75%] ml-auto"
          value={props.periodFilter}
          onChange={(event) => props.setPeriodFilter(event.target.value as PeriodType)}
        >
          <option value="alle">{content.common.filterSection.Alle}</option>
          <option value="Laatste 4 weken">{content.common.filterSection.Laatste4weken}</option>
          <option value="Periodoe van-tot">{content.common.filterSection.PeriodeVanTot}</option>
        </select>
      </div>

      {props.periodFilter === "Periodoe van-tot" && (
        <>
          <div className="grid grid-cols-6 gap-x-2 items-center mt-2">
            <p className="col-span-2 labelClass">{content.common.filterSection.Periodevan}</p>
            <input
              className="inputClass col-span-4 !w-[75%] ml-auto"
              type="date"
              value={props.dateFrom}
              onChange={(event) => props.setDateFrom(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-6 gap-x-2 items-center mt-2">
            <p className="col-span-2 labelClass">{content.common.filterSection.Periodetot}</p>
            <input
              className="inputClass col-span-4 !w-[75%] ml-auto"
              type="date"
              value={props.dateTo}
              onChange={(event) => props.setDateTo(event.target.value)}
            />
          </div>
        </>
      )}

      <div className="flex gap-x-2 text-xs justify-end mt-4">
        <button onClick={applyFilter} className="gray-button">
          {content.common.filteren}
        </button>
        <button onClick={() => props.setOpenFilter(false)} className="gray-button">
          {content.common.annuleren}
        </button>
      </div>
    </div>
  );
}
