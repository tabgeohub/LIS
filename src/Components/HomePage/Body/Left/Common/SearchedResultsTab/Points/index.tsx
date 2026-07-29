import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useOpeSideBarState } from "hooks/zustand/ui/openSideBar";
import { usePopUpState } from "hooks/zustand/ui/popUpState";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { useStarredAll } from "hooks/zustand/ui/starredAll";
import usePointListMapActions from "Components/HomePage/hooks/hover-click-handlers/usePointListMapActions";
import { useRef, useState } from "react";
import { EnrichedPointType } from "Types";
import Header from "./Header";
import Navigation from "./Navigation";
import ClickedPointFunctions from "Components/HomePage/Body/Bottom/ClickedPointFunctions";
import { PointsListRow } from "./PointsListRow";
import {
  usePointsOutlineEffect,
  usePointsStarAllEffect,
  usePointsSyncGraphicsEffect,
} from "./usePointsTableMapEffects";

export default function Points({
  clickedPoint,
  setFase,
  pointsData,
  setClickedPointDetails,
}: {
  clickedPoint: EnrichedPointType | undefined;
  setFase: (value: string) => void;
  pointsData: EnrichedPointType[];
  setClickedPointDetails: (value: EnrichedPointType | undefined) => void;
}) {
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [starredPoints, setStarredPoints] = useState<EnrichedPointType[]>([]);
  const [clickedPointPosition, setClickedPointPosition] = useState<{
    top: number;
    left: number;
  }>();
  const { starredAll } = useStarredAll();
  const { mapView, graphicsLayer, yellowGraphicsLayer } = useMapViewState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setClickedPoint } = usePopUpState();
  const { hoverPoint, clearHover, goToPoint, toggleStarPoint } =
    usePointListMapActions({ starredPoints, setStarredPoints });

  usePointsOutlineEffect(pointsData, graphicsLayer);
  usePointsStarAllEffect({
    pointsData,
    starredPoints,
    setStarredPoints,
    starredAll,
    graphicsLayer,
  });
  usePointsSyncGraphicsEffect({
    pointsData,
    starredPoints,
    mapView,
    graphicsLayer,
    yellowGraphicsLayer,
  });

  const openBottom = (tab: string, point: EnrichedPointType) => {
    setSelectedBottomTab(tab as any);
    setOpenSideBar(true);
    setClickedPoint(point);
  };

  return (
    <div>
      <Header
        pointsData={pointsData}
        setFase={setFase}
        setStarredPoints={setStarredPoints}
        starredPoints={starredPoints}
      />
      <div className="relative w-full border rounded shadow h-[67vh]">
        <div className="z-0 thin-scrollbar h-[60vh] overflow-y-auto">
          {pointsData.map((point) => (
            <PointsListRow
              key={point.id}
              point={point}
              isStarred={starredPoints.some((p) => p.id === point.id)}
              onHover={() => hoverPoint(point)}
              onLeave={clearHover}
              onGoTo={() => goToPoint(point)}
              onToggleStar={(e) => {
                e.stopPropagation();
                toggleStarPoint(point);
              }}
              onOpenDetails={() => {
                setFase("details");
                setClickedPointDetails(point);
              }}
              onOpenMore={(e) => {
                setClickedPointDetails(point);
                const rect = e.currentTarget.getBoundingClientRect();
                setClickedPointPosition({
                  top: rect.bottom,
                  left: rect.left,
                });
              }}
              onEdit={() => openBottom("editSelectedPoint", point)}
              onDelete={() => openBottom("deletePoint", point)}
              onViewPlans={() => openBottom("viewPlans", point)}
              onAddToPlan={() => openBottom("addToPlan", point)}
            />
          ))}
          {clickedPoint && clickedPointPosition && (
            <div
              ref={popupRef}
              className="fixed bg-red-500 max-w-[250px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-50"
              style={{
                top: clickedPointPosition.top - 30,
                left: clickedPointPosition.left + 30,
              }}
            >
              <ClickedPointFunctions clickedPoint={clickedPoint} />
            </div>
          )}
        </div>
        <Navigation pointsData={pointsData} />
      </div>
    </div>
  );
}
