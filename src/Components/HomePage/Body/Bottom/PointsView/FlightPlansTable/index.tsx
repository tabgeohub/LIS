import Graphic from "@arcgis/core/Graphic";
import { PointsViewTableFrame } from "../common/PointsViewTableFrame";
import { useMapViewState } from "hooks/zustand/ui";
import { useOpenTable } from "hooks/zustand/ui";
import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { TfiMoreAlt } from "react-icons/tfi";
import { FlightPlanType } from "Types";
import Data from "./Data";
import {
  addPlanStarGraphic,
  removePlanStarGraphics,
} from "@helpers/ArcGISHelpers/planStarGraphics";
import { useHoverFlightPlanFromOriginalMap } from "Components/HomePage/hooks/hover-click-handlers/planHoverClickHandlers";
import DraggableTableHeader from "../common/components/DraggableTableHeader";

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
  const { graphicsLayerHover, graphicsLayer } = useMapViewState();

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
      addPlanStarGraphic({ plan, layer: graphicsLayer, variant: "table" });
    }
  };

  const HoveredPlan = useHoverFlightPlanFromOriginalMap(originalGraphicsMap);


  return (
    <PointsViewTableFrame containerHeight={containerHeight}>
        <DraggableTableHeader
          columns={visibleColumnsPlans}
          setColumns={setVisibleColumnsPlans}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          removeColumn={removeColumn}
        />

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
    </PointsViewTableFrame>
  );
}
