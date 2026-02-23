import { FinishedPointType } from "Types/finished_plans";
import { FaMapMarkedAlt } from "react-icons/fa";
import { usePointHandlers } from "./hooks/usePointHandlers";

interface PointsProps {
  points: FinishedPointType[];
  selectedPoints: number[];
  onSelectPoint: (point: FinishedPointType) => void;
  onFocusPoint: (pointId: number) => void;
}

export default function Points({
  points,
  selectedPoints,
  onSelectPoint,
  onFocusPoint,
}: PointsProps) {
  const { handleHoveredPoint, handleRemoveHoveredPoint } = usePointHandlers();

  return (
    <>
      {points.map((point) => (
        <div
          className={`flex items-center space-x-3 p-2 py-1 hover:bg-gray-100 transition-all duration-300 ${
            selectedPoints.includes(point.id) && "bg-gray-200"
          }`}
          key={point.id}
          onMouseEnter={() => handleHoveredPoint(point)}
          onMouseLeave={handleRemoveHoveredPoint}
        >
          <input
            type="checkbox"
            className="h-[12px] w-[12px] cursor-pointer"
            onClick={() => onSelectPoint(point)}
            checked={selectedPoints.includes(point.id)}
          />
          <div
            onClick={() => onFocusPoint(point.id)}
            className="flex items-center space-x-1 w-full cursor-pointer"
          >
            <FaMapMarkedAlt className="size-4 text-blue-500" />
            <p>{point.omschrijving}</p>
          </div>
        </div>
      ))}
    </>
  );
}



