import { Dispatch, MutableRefObject, SetStateAction } from "react";
import Graphic from "@arcgis/core/Graphic";
import { EnrichedPointType, FlightPlanType } from "Types";
import PointsTable from "./PointsTable";
import FlightPlansTable from "./FlightPlansTable";
import GeometriesTable from "./GeometriesTable";
import { removeColumn } from "./common/functions/removeColumn";

type DropHandler = (
  targetCol: string,
  columns: string[],
  setFunction: (value: string[] | ((prev: string[]) => string[])) => void
) => void;

type PointsViewTablesProps = {
  tab: string;
  containerHeight: number | undefined;
  containerWidth: number;
  starredPoints: EnrichedPointType[];
  setStarredPoints: Dispatch<SetStateAction<EnrichedPointType[]>>;
  starredPlans: FlightPlanType[];
  setStarredPlans: Dispatch<SetStateAction<FlightPlanType[]>>;
  starredGeometries: any[];
  setStarredGeometries: Dispatch<SetStateAction<any[]>>;
  handleDragStart: (col: string) => void;
  handleDragOver: (e: React.DragEvent<HTMLTableHeaderCellElement>) => void;
  handleDrop: DropHandler;
  setClickedPoint: Dispatch<SetStateAction<EnrichedPointType | undefined>>;
  setClickedPointPosition: Dispatch<
    SetStateAction<{ top: number; left: number } | null>
  >;
  originalGraphicsMap: MutableRefObject<Map<number, Graphic>>;
};

export default function PointsViewTables({
  tab,
  containerHeight,
  containerWidth,
  starredPoints,
  setStarredPoints,
  starredPlans,
  setStarredPlans,
  starredGeometries,
  setStarredGeometries,
  handleDragStart,
  handleDragOver,
  handleDrop,
  setClickedPoint,
  setClickedPointPosition,
  originalGraphicsMap,
}: PointsViewTablesProps) {
  if (tab === "points") {
    return (
      <PointsTable
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        starredPoints={starredPoints}
        setStarredPoints={setStarredPoints}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        removeColumn={removeColumn}
        setClickedPoint={setClickedPoint}
        setClickedPointPosition={setClickedPointPosition}
      />
    );
  }

  if (tab === "geometries") {
    return (
      <GeometriesTable
        containerHeight={containerHeight}
        containerWidth={containerWidth}
        starredGeometries={starredGeometries}
        setStarredGeometries={setStarredGeometries}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        removeColumn={removeColumn}
      />
    );
  }

  return (
    <FlightPlansTable
      containerHeight={containerHeight}
      containerWidth={containerWidth}
      starredPlans={starredPlans}
      setStarredPlans={setStarredPlans}
      handleDragStart={handleDragStart}
      handleDragOver={handleDragOver}
      handleDrop={handleDrop}
      removeColumn={removeColumn}
      setClickedPointPosition={setClickedPointPosition}
      originalGraphicsMap={originalGraphicsMap}
    />
  );
}
