import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import { useOpenAllTable } from "@helpers/ZustandStates/showAllTable";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { EnrichedPointType } from "Types";

import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { TfiMoreAlt } from "react-icons/tfi";
import usePointListMapActions from "hooks/hover-click-handlers/usePointListMapActions";

import { POINT_CORE_DISPLAY_COLUMNS } from "@helpers/points/pointColumnKeys";
import DraggableTableHeader from "../common/components/DraggableTableHeader";

const allColumnsPoints = [...POINT_CORE_DISPLAY_COLUMNS];

export default function PointsTable({
  starredPoints,
  setStarredPoints,
  handleDragStart,
  handleDragOver,
  handleDrop,
  removeColumn,
  setClickedPoint,
  setClickedPointPosition,
  containerHeight,
  containerWidth,
}: any) {
  const activities = useConstSelectOptions("activiteiten");
  const organizations = useConstSelectOptions("organisaties");

  useOpenAllTable(); // kept if you need elsewhere
  const { pointsTable } = useOpenTable();

  const [visibleColumnsPoints, setVisibleColumnsPoints] =
    useState(allColumnsPoints);

  const { hoverPoint, clearHover, goToPoint, toggleStarPoint } =
    usePointListMapActions({
      starredPoints,
      setStarredPoints,
    });

  return (
    <div
      className="w-max min-w-full"
      style={{
        minHeight:
          typeof containerHeight === "number"
            ? `${containerHeight}px`
            : undefined,
      }}
    >
      <table className="min-w-max text-[11px] text-left rtl:text-right text-gray-500 border-2 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <DraggableTableHeader
          columns={visibleColumnsPoints}
          setColumns={setVisibleColumnsPoints}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          removeColumn={removeColumn}
        />

        <tbody>
          {pointsTable.map((point: EnrichedPointType, index: number) => {
            const isStarred = starredPoints.some(
              (p: EnrichedPointType) => p.id === point.id
            );
            return (
              <tr
                key={index}
                className={`relative px-2 py-6 ${
                  isStarred
                    ? "bg-blue-100"
                    : index % 2 === 0
                    ? "bg-white hover:bg-gray-100"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onMouseEnter={() => hoverPoint(point)}
                onMouseLeave={clearHover}
                onClick={() => goToPoint(point)}
              >
                <td className="px-2 py-1 align-middle">
                  <div className="flex items-center gap-1 leading-none">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarPoint(point);
                      }}
                      className="p-0.5"
                    >
                      <FaStar
                        className={`block h-4 w-4 shrink-0 ${
                          isStarred ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        const rect = (
                          e.currentTarget as HTMLButtonElement
                        ).getBoundingClientRect();

                        setClickedPoint(point);

                        setClickedPointPosition({
                          top: rect.bottom,
                          left: rect.left,
                        });
                      }}
                      className="p-0.5"
                    >
                      <TfiMoreAlt className="block h-4 w-4 shrink-0" />
                    </button>
                  </div>
                </td>

                {visibleColumnsPoints.map((col: string) => (
                  <td key={col} className="px-2 py-4 whitespace-nowrap">
                    {col === "activiteit_id"
                      ? activities.find(
                          (a) =>
                            a.value === point[col as keyof EnrichedPointType]
                        )?.label
                      : col === "organisatie_id"
                      ? organizations.find(
                          (o) =>
                            o.value === point[col as keyof EnrichedPointType]
                        )?.label
                      : (point[col as keyof EnrichedPointType] as any)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
