import SelectButtons from "./SelectButtons";

export default function Header({
  herhalen,
  filterTerm,
  setFilterTerm,
  selectedGeometries,
  setSelectedGeometries,
  filteredGeometries,
}: {
  herhalen: boolean;
  filterTerm: string;
  setFilterTerm: (value: string) => void;
  selectedGeometries?: number[];
  setSelectedGeometries?: (value: number[]) => void;
  filteredGeometries?: any[];
}) {
  return (
    <>
      <p className="text-gray-800 leading-3 text-[10px]">
        {herhalen === true &&
          "(1) Selecteer de gewenste herhalende aandachtspunten en klik op 'Volgende'. Selecteer meerdere aandachtspunten door de Ctrl toets ingedrukt te houden."}

        {herhalen === false &&
          "(2) Selecteer de gewenste overige aandachtspunten en klik op 'Toevoegen'. Selecteer meerdere aandachtspunten door de Ctrl toets ingedrukt te houden."}
      </p>

      <input
        type="text"
        placeholder="Filter resultaten"
        className="inputClass mt-1 !rounded-lg !px-2 !py-0 !pb-0.5 placeholder:text-[10px]"
        value={filterTerm}
        onChange={(e) => setFilterTerm(e.target.value)}
      />

      <SelectButtons 
        herhalen={herhalen}
        selectedGeometries={selectedGeometries}
        setSelectedGeometries={setSelectedGeometries}
        filteredGeometries={filteredGeometries}
      />
    </>
  );
}
