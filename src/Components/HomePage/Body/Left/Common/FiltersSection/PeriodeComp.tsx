import { FilterInput } from "./FilterInput";

export default function PeriodeComp({
  van,
  setVan,
  tot,
  setTot,
}: {
  van: string;
  setVan: (value: string) => void;
  tot: string;
  setTot: (value: string) => void;
}) {
  return (
    <div className="relative rounded border border-gray-600 p-2">
      <p className="absolute bg-white labelClass -top-3 left-4 text-[12px] px-0.5">
        Periode
      </p>

      <div className="space-y-2 my-3">
        <div className="border border-gray-600 rounded p-0.5">
          <FilterInput
            minToday={false}
            label="Van"
            value={van}
            setValue={setVan}
            type="date"
          />
        </div>

        <div className="border border-gray-600 rounded p-0.5">
          <FilterInput
            label="Tot"
            minToday={false}
            value={tot}
            setValue={setTot}
            type="date"
          />
        </div>
      </div>
    </div>
  );
}
