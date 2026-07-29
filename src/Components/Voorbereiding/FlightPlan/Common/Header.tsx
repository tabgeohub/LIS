import SelectButtons from "./SelectButtons";
import { useContent } from "hooks/useContent";

export default function Header({
  herhalen,
  filterText,
  setFilterText,
}: {
  herhalen: boolean;
  filterText: string;
  setFilterText: (value: string) => void;
}) {
  const content = useContent();

  return (
    <>
      <p className="text-gray-800 leading-3 text-[10px]">
        {herhalen
          ? content.voorbereiding.vluchtAanmaken.step2.text
          : content.voorbereiding.vluchtAanmaken.step3.text}
      </p>

      <input
        type="text"
        placeholder="Filter resultaten"
        className="inputClass mt-1 !rounded-lg !px-2 !py-0 !pb-0.5 placeholder:text-[10px]"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <SelectButtons herhalen={herhalen} />
    </>
  );
}
