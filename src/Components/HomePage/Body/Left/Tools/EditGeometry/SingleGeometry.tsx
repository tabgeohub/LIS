import { Geometry } from "hooks/features/useGeometriesStore";
import { TbPolygon, TbLine } from "react-icons/tb";
import ActionButtons from "./ActionButtons";

export default function SingleGeometry({
  geometry,
  onEditClick,
  onDeleteClick,
}: {
  geometry: Geometry;
  onEditClick: (geometry: Geometry) => void;
  onDeleteClick: (geometry: Geometry) => void;
}) {
  const geometryTypeLabel = geometry.type === "polygon" ? "Veelhoek" : "Lijn";

  return (
    <div className="p-2 transition-all shadow hover:bg-gray-50">
      <div className="flex items-center gap-x-2">
        {geometry.type === "polygon" ? (
          <TbPolygon className="size-5 text-yellow-500" />
        ) : (
          <TbLine className="size-5 text-green-500" />
        )}
        <div className="flex-1">
          <p className="text-gray-900 text-[14px]">
            {geometry.omschrijving || `Geometrie ${geometry.id}`}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Type: {geometryTypeLabel}
          </p>
        </div>
      </div>

      <ActionButtons
        geometry={geometry}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    </div>
  );
}

