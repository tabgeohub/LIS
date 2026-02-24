import { useContent } from "hooks/useContent";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";

export default function Header({
  setFilterTerm,
}: {
  setFilterTerm: (value: string) => void;
}) {
  const { dbGeometries } = useGeometriesStore();
  const content = useContent();

  return (
    <>
      <p className="text-[12px] text-gray-700 pt-1.5 px-1.5">
        {dbGeometries.length} geometrie{dbGeometries.length !== 1 ? "ën" : ""} gevonden
      </p>

      <div className="pb-1.5 px-1">
        <input
          placeholder="Filter resultaten"
          onChange={(e) => setFilterTerm(e.target.value)}
          className="inputClass mt-2 !p-1 placeholder:text-[12px]"
        />
      </div>

      <div className="bg-gray-200 w-full h-[1px]" />
    </>
  );
}

