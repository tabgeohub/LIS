import Graphic from "@arcgis/core/Graphic";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdFilterAlt } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";
import { TfiMoreAlt } from "react-icons/tfi";
import { FlightPlanType } from "Types";
import Data from "./Data";
import {
  createPlanBoundingBoxGraphic,
  getFlightPlanPoints,
  PLAN_BOUNDING_BOX_SYMBOLS,
} from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";
import {
  addPlanStarGraphic,
  removePlanStarGraphics,
} from "hooks/hover-click-handlers/usePlanStarGraphic";

const allColumnsPlans = [
  "Aanmaker vlieplan",
  "Aanmaker datum",
  "Vluchtnummer",
  "Omschrijving",
  "Waarnemer",
  "Piloot",
  "Inspectiedatum",
  "Regio",
  "Aantal passagiers",
  "Doel en hoofdthema",
  "Aanvullende informatie",
  "Geplande vliegduur",
  "Begintijd en datum",
  "Eindtijd en datum",
  "Werkelijke vliegduur",
  "Gevlogen afstand",
  "Status",
];

export default function FlightPlansTable({
  starredPlans,
  setStarredPlans,
  handleDragStart,
  handleDragOver,
  handleDrop,
  removeColumn,
  setClickedPointPosition,
  originalGraphicsMap,
  containerHeight,
  containerWidth,
}: {
  starredPlans: FlightPlanType[];
  setStarredPlans: (
    value: FlightPlanType[] | ((prev: FlightPlanType[]) => FlightPlanType[])
  ) => void;
  handleDragStart: (col: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLTableHeaderCellElement>) => void;
  handleDrop: (
    targetCol: string,
    columns: string[],
    setFunction: (value: string[] | ((prev: string[]) => string[])) => void
  ) => void;
  removeColumn: (
    colName: string,
    setFunction: (value: string[] | ((prev: string[]) => string[])) => void
  ) => void;
  setClickedPointPosition: (
    value: { top: number; left: number } | null
  ) => void;
  originalGraphicsMap: React.MutableRefObject<Map<number, Graphic>>;
  containerHeight?: number;
  containerWidth?: number;
}) {
  const { flightPlans } = useOpenTable();
  const { graphicsLayerHover, graphicsLayer, mapView } = useMapViewState();

  const [visibleColumnsPlans, setVisibleColumnsPlans] =
    useState(allColumnsPlans);

  const toggleStarPlan = (plan: FlightPlanType) => {
    if (!graphicsLayer) return;
    const alreadyStarred = starredPlans.find((p) => p.id === plan.id);

    if (alreadyStarred) {
      setStarredPlans((prev) => prev.filter((p) => p.id !== plan.id));
      removePlanStarGraphics(plan.id, graphicsLayer);
    } else {
      setStarredPlans((prev) => [...prev, plan]);

      const oldGraphic = originalGraphicsMap.current.get(plan.id);
      if (oldGraphic) {
        graphicsLayer.remove(oldGraphic);
      }

      graphicsLayerHover?.removeAll();
      addPlanStarGraphic(plan, graphicsLayer, "table");
    }
  };

  const HoveredPlan = (plan: FlightPlanType) => {
    if (!mapView || !graphicsLayerHover || !graphicsLayer) return;

    const oldGraphic = originalGraphicsMap.current.get(plan.id);
    if (oldGraphic) {
      graphicsLayer.remove(oldGraphic);
    }

    graphicsLayerHover.removeAll();

    const hoverGraphic = createPlanBoundingBoxGraphic(getFlightPlanPoints(plan), {
      symbolOptions: PLAN_BOUNDING_BOX_SYMBOLS.hoverSearchList,
    });

    if (hoverGraphic) {
      graphicsLayerHover.add(hoverGraphic);
    }
  };

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
            {visibleColumnsPlans.map((col) => (
              <th
                key={col}
                className="px-2 py-2 cursor-move whitespace-nowrap"
                draggable
                onDragStart={() => handleDragStart(col)}
                onDragOver={handleDragOver}
                onDrop={() =>
                  handleDrop(col, visibleColumnsPlans, setVisibleColumnsPlans)
                }
              >
                <div className="flex justify-between items-center gap-1">
                  <button title="Drag column">
                    <RxDragHandleDots2 />
                  </button>
                  <span>{col}</span>
                  <button
                    onClick={() => removeColumn(col, setVisibleColumnsPlans)}
                  >
                    <IoClose />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {flightPlans.map((plan: FlightPlanType, index: number) => {
            const isStarred = starredPlans.some((p) => p.id === plan.id);

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
                onMouseEnter={() => HoveredPlan(plan)}
                onMouseLeave={() => graphicsLayerHover?.removeAll()}
              >
                <td className="px-2 py-1 align-middle whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <FaStar
                      className={`cursor-pointer text-xl ${
                        isStarred ? "text-blue-500" : "text-gray-400"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarPlan(plan);
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const rect = (
                          e.currentTarget as HTMLButtonElement
                        ).getBoundingClientRect();
                        setClickedPointPosition({
                          top: rect.bottom,
                          left: rect.left,
                        });
                      }}
                      className="p-0.5"
                    >
                      <TfiMoreAlt className="h-4 w-4 shrink-0" />
                    </button>
                  </div>
                </td>

                <Data plan={plan} visibleColumnsPlans={visibleColumnsPlans} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
