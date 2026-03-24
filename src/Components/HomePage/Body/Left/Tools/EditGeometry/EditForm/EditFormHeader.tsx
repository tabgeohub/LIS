import { TbLine, TbPolygon } from "react-icons/tb";
import { Geometry } from "hooks/features/useGeometriesStore";

export default function EditFormHeader({ geometry }: { geometry: Geometry }) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
      {geometry.type === "polygon" ? (
        <TbPolygon className="size-6 text-yellow-500 shrink-0" />
      ) : (
        <TbLine className="size-6 text-green-500 shrink-0" />
      )}
      <div>
        <p className="text-[13px] font-semibold text-gray-800">
          Geometrie bewerken
        </p>
        <p className="text-[10px] text-gray-500">ID: {geometry.id}</p>
      </div>
    </div>
  );
}
