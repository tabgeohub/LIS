import { EnrichedPointType } from "Types";

export default function Navigation({
  pointsData,
}: {
  pointsData: EnrichedPointType[];
}) {
  return (
    <div className="absolute z-20 bg-white bottom-0 left-0 w-full px-4 py-2 text-sm text-gray-700 flex justify-between items-center border-t">
      <span>
        Weergeven resultaat 1 - {pointsData.length} (Totaal: {pointsData.length}
        )
      </span>
      <div className="flex items-center gap-1">
        <button className="text-gray-400 hover:text-gray-600">&laquo;</button>
        <span>Pagina 1 van 1</span>
        <button className="text-gray-400 hover:text-gray-600">&raquo;</button>
      </div>
    </div>
  );
}
