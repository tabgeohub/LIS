import { ReactNode } from "react";

type FlightPlanClickableRowProps = {
  selected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: ReactNode;
  className?: string;
};

/** Shared clickable row shell for flight-plan list items. */
export default function FlightPlanClickableRow({
  selected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
  className = "",
}: FlightPlanClickableRowProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`p-2 hover:bg-gray-100 ${
        selected && "bg-gray-200"
      } transition-all cursor-pointer ${className}`.trim()}
    >
      {children}
    </div>
  );
}
