import { useOpenAllTable } from "@helpers/ZustandStates/showAllTable";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { EnrichedPointType } from "Types";

import { MdFilterAlt } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { TfiMoreAlt } from "react-icons/tfi";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import usePointListMapActions from "hooks/hover-click-handlers/usePointListMapActions";

const allColumnsPoints = [
  "omschrijving",
  "regio_id",
  "xcoordinaat_rd",
  "ycoordinaat_rd",
  "latitude",
  "longitude",
  "herhalen",
  "vertrouwelijk",
  "activiteit_id",
  "organisatie_id",
  "specifiek_letten_op",
  "datum",
];

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
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();

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
        <thead className="text-[12px] sticky top-0 bg-white z-10">
          <tr>
            <th className="px-2 py-2">
              <MdFilterAlt className="text-gray-500 text-xl" />
            </th>

            {visibleColumnsPoints.map((col: string) => (
              <th
                key={col}
                className="px-2 py-2 cursor-move whitespace-nowrap"
                draggable
                onDragStart={() => handleDragStart(col)}
                onDragOver={handleDragOver}
                onDrop={() =>
                  handleDrop(col, visibleColumnsPoints, setVisibleColumnsPoints)
                }
              >
                <div className="flex justify-between items-center gap-1">
                  <button title="Drag column">
                    <RxDragHandleDots2 />
                  </button>
                  <span>{col}</span>
                  <button
                    onClick={() => removeColumn(col, setVisibleColumnsPoints)}
                  >
                    <IoClose />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>

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
