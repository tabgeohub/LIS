import { Geometry } from "hooks/features/useGeometriesStore";
import { TbLine, TbPolygon } from "react-icons/tb";

export default function SelectableGeometryList({
  geometries,
  selectedIds,
  setSelectedIds,
  showTypeIcon = false,
}: {
  geometries: Geometry[];
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  showTypeIcon?: boolean;
}) {
  const toggle = (id: number) =>
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id]
    );

  return (
    <div className="pr-2 mt-2 mb-4 pl-10">
      <div className="mt-2 border w-full border-gray-300 overflow-y-scroll">
        {geometries.map((geometry) => (
          <div
            key={geometry.id}
            onClick={() => toggle(geometry.id)}
            className={`flex items-center cursor-pointer gap-x-2 px-1.5 pt-0.5 ${
              selectedIds.includes(geometry.id) ? "bg-gray-200" : ""
            }`}
          >
            <input
              type="checkbox"
              className="size-3 cursor-pointer"
              checked={selectedIds.includes(geometry.id)}
              onChange={() => toggle(geometry.id)}
            />
            {showTypeIcon &&
              (geometry.type === "polygon" ? (
                <TbPolygon className="size-4 text-yellow-500" />
              ) : (
                <TbLine className="size-4 text-green-500" />
              ))}
            <label className="text-[12px] cursor-pointer">
              {geometry.omschrijving || `Geometrie ${geometry.id}`}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
