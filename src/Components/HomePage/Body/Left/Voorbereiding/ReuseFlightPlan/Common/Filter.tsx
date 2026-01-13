import { useFilterPlans } from "hooks/filters/useFilterPlans";
import {
  PeriodType,
  usePlansFilterStore,
} from "hooks/filters/usePlansFilterStore";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { FlightPlanType } from "Types";

export default function Filter({ plans }: { plans: FlightPlanType[] }) {
  const {
    filterText,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    periodFilter,
    setPeriodFilter,
  } = usePlansFilterStore();

  const { setOpenFilter, setFilteredPlans } = useReuseFlightPlan();
  const filterPlans = useFilterPlans();

  return (
    <div className="p-1.5">
      <div className="grid grid-cols-6 gap-x-2 items-center">
        <p className="col-span-2 labelClass">Periode:</p>

        <select
          className="inputClass col-span-4 !w-[75%] ml-auto"
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value as PeriodType)}
        >
          <option value="alle">Alle</option>
          <option value="Laatste 4 weken">Laatste 4 weken</option>
          <option value="Periodoe van-tot">Periodoe van-tot</option>
        </select>
      </div>

      {periodFilter === "Periodoe van-tot" && (
        <>
          <div className="grid grid-cols-6 gap-x-2 items-center mt-2">
            <p className="col-span-2 labelClass">Periode van</p>

            <input
              className="inputClass col-span-4 !w-[75%] ml-auto"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-6 gap-x-2 items-center mt-2">
            <p className="col-span-2 labelClass">Periode tot</p>

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

            filterPlans(
              setFilteredPlans,
              plans,
              filterText,
              dateFrom,
              dateTo,
              periodFilter
            );
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
