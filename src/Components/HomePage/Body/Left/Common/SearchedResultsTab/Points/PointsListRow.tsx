import { FaStar } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { TfiMoreAlt } from "react-icons/tfi";
import type { EnrichedPointType } from "Types";
import { PointsRowActionLinks } from "./PointsRowActionLinks";

export function PointsListRow(props: {
  point: EnrichedPointType;
  isStarred: boolean;
  onHover: () => void;
  onLeave: () => void;
  onGoTo: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
  onOpenDetails: () => void;
  onOpenMore: (e: React.MouseEvent<SVGElement>) => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewPlans: () => void;
  onAddToPlan: () => void;
}) {
  return (
    <div
      className="px-4 py-1 border-b hover:bg-neutral-100"
      onMouseEnter={props.onHover}
      onMouseLeave={props.onLeave}
      onClick={props.onGoTo}
    >
      <div className="flex items-center justify-between">
        <div className="relative flex items-center gap-2 text-sm font-medium text-gray-800">
          <FaStar
            className={`cursor-pointer ${
              props.isStarred ? "text-blue-500" : "text-gray-400"
            }`}
            onClick={props.onToggleStar}
          />
          <span>{props.point.omschrijving}</span>
        </div>
        <div className="relative flex gap-x-2 my-auto">
          <IoIosArrowForward
            className="text-gray-500 my-auto"
            onClick={props.onOpenDetails}
          />
          <span className="text-gray-500 my-auto text-xl font-bold">|</span>
          <TfiMoreAlt
            className="text-gray-500 my-auto"
            onClick={props.onOpenMore}
          />
        </div>
      </div>
      <PointsRowActionLinks
        onEdit={props.onEdit}
        onDelete={props.onDelete}
        onViewPlans={props.onViewPlans}
        onAddToPlan={props.onAddToPlan}
      />
    </div>
  );
}
