import { ReactNode } from "react";
import { FaStar } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { TfiMoreAlt } from "react-icons/tfi";
import { EnrichedPointType } from "Types";

export type ResultTabPointRowProps = {
  point: EnrichedPointType;
  isStarred: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onRowClick: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
  onOpenDetails: () => void;
  onOpenMoreMenu: (e: React.MouseEvent) => void;
  footer?: ReactNode;
  layout?: "inline" | "stacked";
};

export default function ResultTabPointRow({
  point,
  isStarred,
  onMouseEnter,
  onMouseLeave,
  onRowClick,
  onToggleStar,
  onOpenDetails,
  onOpenMoreMenu,
  footer,
  layout = "inline",
}: ResultTabPointRowProps) {
  const actions = (
    <div className="relative flex gap-x-2 my-auto">
      <span className="my-auto">
        <IoIosArrowForward
          className="text-gray-500 my-auto"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails();
          }}
        />
      </span>
      <span className="text-gray-500 my-auto text-xl font-bold">|</span>
      <TfiMoreAlt
        className="text-gray-500 my-auto"
        onClick={(e) => {
          e.stopPropagation();
          onOpenMoreMenu(e);
        }}
      />
    </div>
  );

  const label = (
    <div className="relative flex items-center gap-2 text-sm font-medium text-gray-800">
      <FaStar
        className={`cursor-pointer ${
          isStarred ? "text-blue-500" : "text-gray-400"
        }`}
        onClick={onToggleStar}
      />
      <span>{point.omschrijving}</span>
    </div>
  );

  if (layout === "stacked") {
    return (
      <div
        className="px-4 py-1 border-b hover:bg-neutral-100"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onRowClick}
      >
        <div className="flex items-center justify-between">
          {label}
          {actions}
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between px-4 py-1 border-b hover:bg-neutral-100"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onRowClick}
    >
      {label}
      {actions}
    </div>
  );
}
