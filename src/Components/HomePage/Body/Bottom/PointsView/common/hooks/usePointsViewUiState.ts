import { useState } from "react";
import { EnrichedPointType, FlightPlanType } from "Types";

export function usePointsViewUiState() {
  const [clickedPoint, setClickedPoint] = useState<EnrichedPointType>();
  const [clickedPointPosition, setClickedPointPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [draggingCol, setDraggingCol] = useState<string | null>(null);
  const [starredPoints, setStarredPoints] = useState<EnrichedPointType[]>([]);
  const [starredPlans, setStarredPlans] = useState<FlightPlanType[]>([]);
  const [starredGeometries, setStarredGeometries] = useState<any[]>([]);
  const [tab, setTab] = useState("points");
  return {
    tab, setTab, clickedPoint, setClickedPoint, clickedPointPosition,
    setClickedPointPosition, draggingCol, setDraggingCol, starredPoints,
    setStarredPoints, starredPlans, setStarredPlans, starredGeometries,
    setStarredGeometries,
  };
}
