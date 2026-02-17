import { useContent } from "hooks/useContent";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { usePointsStore } from "hooks/zustand/usePointsStore";

export default function Header({
  setFilterTerm,
}: {
  setFilterTerm: (value: string) => void;
}) {
  const { points } = usePointsStore();

  const { setSelectedPoints } = useDeletePointState();

  const content = useContent();

  return (
    <>
      <p className="text-[12px] text-gray-700 pt-1.5 px-1.5">
        {content.tools.aandachtspuntenVerwijderen.pointsList.header.replace(
          "{pointsLength}",
          String(points.length)
        )}
      </p>

      <div className="pb-1.5 px-1">
        <input
          placeholder="Filter resultaten"
          onChange={(e) => setFilterTerm(e.target.value)}
          className="inputClass mt-2 !p-1 placeholder:text-[12px]"
        />

        <div className="text-[13px] flex text-blue-500 items-center gap-x-2 mt-1 font-medium">
          {/* <button onClick={() => setSelectedPoints(points)}>
            {content.tools.aandachtspuntenVerwijderen.pointsList.selecteerAlle}
          </button>

          <div className="h-[16px] w-[1px] bg-blue-300" /> */}

          <button onClick={() => setSelectedPoints([])}>
            {content.tools.aandachtspuntenVerwijderen.pointsList.selecteerGeen}
          </button>
        </div>
      </div>

      <div className="bg-gray-200 w-full h-[1px]" />
    </>
  );
}
