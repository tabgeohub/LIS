import { useContent } from "hooks/useContent";
import { useFilterPlans } from "hooks/filters/useFilterPlans";

export type PeriodFilterStoreSlice = {
  periode: string;
  setPeriode: (value: string) => void;
  dateFrom: string;
  setDateFrom: (value: string) => void;
  dateTo: string;
  setDateTo: (value: string) => void;
  setOpenFilter: (value: boolean) => void;
  filteredPlans: { datum: string; vluchtnummer: string }[];
  setFilteredPlans: (value: { datum: string; vluchtnummer: string }[]) => void;
  filterTerm: string;
};

export default function PeriodFilterPanel({
  store,
}: {
  store: PeriodFilterStoreSlice;
}) {
  const {
    periode,
    setPeriode,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    setOpenFilter,
    filteredPlans,
    setFilteredPlans,
    filterTerm,
  } = store;

  const filterPlans = useFilterPlans();
  const content = useContent();

  return (
    <div className="p-1.5">
      <div className="grid grid-cols-6 gap-x-2 items-center">
        <p className="col-span-2 labelClass">
          {content.common.filterSection.periode}:
        </p>

        <select
          className="inputClass col-span-4 !w-[75%] ml-auto"
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
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

      {periode === "Periodoe van-tot" && (
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
            filterPlans(
              setFilteredPlans,
              filteredPlans,
              filterTerm,
              dateFrom,
              dateTo,
              periode
            );
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
