import { usePointsStore } from "hooks/zustand/usePointsStore";

export default function Header({
  setFilterTerm,
}: {
  setFilterTerm: (value: string) => void;
}) {
  const { points } = usePointsStore();

  return (
    <>
      <p className="text-[12px] text-gray-700">
        Er zijn {points.length} aandachtspunten geselecteerd. Met de knop
        ‘Kaartfilter’ kunnen aandachtspunten op de kaart worden gefilterd.
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
