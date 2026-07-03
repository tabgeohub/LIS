import { Geometry } from "hooks/features/useGeometriesStore";
import { TbLine, TbPolygon } from "react-icons/tb";
import { formatHerhalenLabel } from "./geometryHerhalen";

export function GeometryItemCheckBox({
  geometry,
  isSelected,
  onMouseEnter,
  onMouseLeave,
  onCheckboxClick,
  onItemClick,
}: {
  geometry: Geometry;
  isSelected: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onCheckboxClick?: (e: React.MouseEvent) => void;
  onItemClick?: () => void;
}) {
  const geometryTypeLabel = geometry.type === "polygon" ? "Veelhoek" : "Lijn";

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      key={geometry.id}
      className={`flex items-start cursor-pointer gap-x-2 py-2 my-1 px-2 transition-all duration-300 ${
        isSelected
          ? "bg-gray-200 shadow-sm rounded"
          : "hover:bg-blue-100 shadow-sm rounded"
      }`}
      onClick={onItemClick}
    >
      <div className="flex items-center gap-x-2">
        <input
          checked={isSelected}
          onClick={onCheckboxClick}
          type="checkbox"
          className="size-3 cursor-pointer"
          readOnly
        />
        {geometry.type === "polygon" ? (
          <TbPolygon className="size-6 text-yellow-500" />
        ) : (
          <TbLine className="size-6 text-green-500" />
        )}
      </div>

      <div className="flex flex-col ml-6 text-[10px]">
        <div className="flex gap-x-1 font-medium">
          <p className="text-gray-800">{geometry.omschrijving}</p>
        </div>

        <div className="flex gap-x-1">
          <p className="text-gray-600">Type: </p>
          <p className="text-gray-600">{geometryTypeLabel}</p>
        </div>

        {geometry.activiteit && (
          <div className="flex gap-x-1">
            <p className="text-gray-600">Activiteit </p>
            <p className="text-gray-600">{geometry.activiteit}</p>
          </div>
        )}

        {geometry.organisatie && (
          <div className="flex gap-x-1">
            <p className="text-gray-600">Organisatie </p>
            <p className="text-gray-600">{geometry.organisatie}</p>
          </div>
        )}

        {geometry.specifiek_letten_op && (
          <div className="flex gap-x-1">
            <p className="text-gray-600">Letten op: </p>
            <p className="text-gray-600">{geometry.specifiek_letten_op}</p>
          </div>
        )}

        <div className="flex gap-x-1">
          <p className="text-gray-600">Herhalen: </p>
          <p className="text-gray-600">{formatHerhalenLabel(geometry.herhalen)}</p>
        </div>
      </div>
    </div>
  );
}
