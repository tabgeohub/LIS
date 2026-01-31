/* eslint-disable react-hooks/exhaustive-deps */
import { EnrichedPointType } from "Types";
import ActionButtons from "./ActionButtons";
import usePointClick from "hooks/hover-click-handlers/usePointClick";
import usePointHover from "hooks/hover-click-handlers/usePointHover";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import useLogAction from "hooks/useLogAction";
import { useEffect } from "react";

export default function SinglePoint({ point }: { point: EnrichedPointType }) {
  const logAction = useLogAction();

  const { selectedPoints, setSelectedPoints } = useDeletePointState();

  const handleSelectChange = () => {
    // Radio button: select only this point
    setSelectedPoints([point]);
  };

  usePointClick(selectedPoints);
  const { handleHoveredPoint, handleRemoveHoverePoint } = usePointHover();

  useEffect(() => {
    logAction({
      message: "User is selecting points",
      step: "Main step",
      newData: {
        points: selectedPoints,
      },
    });
  }, [selectedPoints]);

  return (
    <div
      onMouseEnter={() => handleHoveredPoint(point)}
      onMouseLeave={handleRemoveHoverePoint}
      onClick={() => {
        setSelectedPoints([point]);
      }}
      className={`p-2 transition-all shadow ${selectedPoints.includes(point) ? "bg-gray-100" : "hover:bg-gray-50"
        }`}
    >
      <div className="flex items-center gap-x-1 cursor-pointer">
        <input
          id={`radio-${point.id}`}
          type="radio"
          name="selectedPoint"
          checked={selectedPoints.length === 1 && selectedPoints[0]?.id === point.id}
          onChange={handleSelectChange}
          className="h-3 w-3 mt-0.5 cursor-pointer"
        />
        <label htmlFor={`radio-${point.id}`} className="text-gray-900 cursor-pointer text-[14px]">
          {point.omschrijving}
        </label>
      </div>

      <ActionButtons point={point} />
    </div>
  );
}
