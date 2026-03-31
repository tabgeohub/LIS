import { FaMapPin } from "react-icons/fa";
import { FinishedPointType } from "Types/finished_plans";
import SelectedPlanRowActions from "./SelectedPlanRowActions";

export default function SelectedPlanPointRow({
  point,
  vluchtnummers,
  onGoTo,
  onDropdownClick,
  accordionOpen,
}: {
  point: FinishedPointType;
  vluchtnummers: string[];
  onGoTo: () => void;
  onDropdownClick?: () => void;
  accordionOpen?: boolean;
}) {
  return (
    <div className="px-3 py-2 transition-colors hover:bg-gray-50">
      <div className="flex items-start gap-2">
        <FaMapPin className="mt-0.5 size-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-medium text-gray-800">
            {point.omschrijving || `Punt ${point.id}`}
          </p>
          <p className="break-words text-[10px] text-gray-500">
            {vluchtnummers.join(" / ")}
          </p>
        </div>
        <SelectedPlanRowActions
          onGoTo={onGoTo}
          onDropdownClick={onDropdownClick}
          accordionOpen={accordionOpen}
        />
      </div>
    </div>
  );
}
