import { TbLine, TbPolygon } from "react-icons/tb";
import { FinishedGeometryType } from "Types/finished_plans";
import SelectedPlanRowActions from "./SelectedPlanRowActions";

export default function SelectedPlanGeometryRow({
  geometry,
  geometryLabel,
  vluchtnummers,
  onMouseEnter,
  onMouseLeave,
  onGoTo,
  onDropdownClick,
}: {
  geometry: FinishedGeometryType;
  geometryLabel: string;
  vluchtnummers: string[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onGoTo: () => void;
  onDropdownClick?: () => void;
}) {
  const isPolygon = (geometry.geometry_type || "")
    .toLowerCase()
    .includes("polygon");

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="px-3 py-2 transition-colors hover:bg-gray-50"
    >
      <div className="flex items-start gap-2">
        {isPolygon ? (
          <TbPolygon className="mt-0.5 size-4 shrink-0 text-yellow-500" />
        ) : (
          <TbLine className="mt-0.5 size-4 shrink-0 text-green-500" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-medium text-gray-800">
            {geometryLabel}
          </p>
          <p className="break-words text-[10px] text-gray-500">
            {vluchtnummers.join(" / ")}
          </p>
        </div>
        <SelectedPlanRowActions
          onGoTo={onGoTo}
          onDropdownClick={onDropdownClick}
        />
      </div>
    </div>
  );
}
