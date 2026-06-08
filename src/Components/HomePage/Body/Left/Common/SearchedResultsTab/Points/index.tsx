/* eslint-disable react-hooks/exhaustive-deps */
import {
  addStarPointGraphics,
  createSearchResultPointOutlineGraphic,
  getUnstarredPoints,
  mergeStarredPoints,
  syncPointsTableMapGraphics,
} from "@helpers/ArcGISHelpers/createPointMapGraphics";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useStarredAll } from "@helpers/ZustandStates/starredAll";
import usePointListMapActions from "hooks/hover-click-handlers/usePointListMapActions";
import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { TfiMoreAlt } from "react-icons/tfi";
import { EnrichedPointType } from "Types";
import Header from "./Header";
import Navigation from "./Navigation";
import ClickedPointFunctions from "Components/HomePage/Body/Bottom/ClickedPointFunctions";
import { useContent } from "hooks/useContent";

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
    usePointListMapActions({
      starredPoints,
      setStarredPoints,
    });

  const hasRunFilter = useRef(false);
  const hasRunStar = useRef(false);

  useEffect(() => {
    if (pointsData.length > 0 && !hasRunFilter.current) {
      hasRunFilter.current = true;

      pointsData.forEach((point) => {
        graphicsLayer?.graphics.add(createSearchResultPointOutlineGraphic(point));
      });
    }
  }, []);

  useEffect(() => {
    if (starredAll && !hasRunStar.current) {
      hasRunStar.current = true;

      if (!graphicsLayer) return;

      const newStars = getUnstarredPoints(pointsData, starredPoints);
      setStarredPoints(mergeStarredPoints(starredPoints, newStars));
      addStarPointGraphics(newStars, graphicsLayer);
    }
  }, [starredAll]);

  useEffect(() => {
    graphicsLayer?.removeAll();
    yellowGraphicsLayer?.graphics.removeAll();
    if (!validateMapView(mapView, yellowGraphicsLayer)) return;

    syncPointsTableMapGraphics({
      points: pointsData,
      starredPoints,
      yellowGraphicsLayer,
      graphicsLayer,
    });
  }, []);

  const content = useContent();

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
          {pointsData.map((point) => {
            const isStarred = starredPoints.some((p) => p.id === point.id);
            return (
              <div
                key={point.id}
                className="px-4 py-1 border-b hover:bg-neutral-100"
                onMouseEnter={() => hoverPoint(point)}
                onMouseLeave={clearHover}
                onClick={() => goToPoint(point)}
              >
                <div className="flex items-center justify-between">
                  <div className="relative flex items-center gap-2 text-sm font-medium text-gray-800">
                    <FaStar
                      className={`cursor-pointer ${
                        isStarred ? "text-blue-500" : "text-gray-400"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStarPoint(point);
                      }}
                    />
                    <span>{point.omschrijving}</span>
                  </div>
                  <div className="relative flex gap-x-2 my-auto">
                    <IoIosArrowForward
                      className="text-gray-500 my-auto"
                      onClick={() => {
                        setFase("details");
                        setClickedPointDetails(point);
                      }}
                    />
                    <span className="text-gray-500 my-auto text-xl font-bold">
                      |
                    </span>
                    <TfiMoreAlt
                      className="text-gray-500 my-auto"
                      onClick={(e) => {
                        setClickedPointDetails(point);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setClickedPointPosition({
                          top: rect.bottom,
                          left: rect.left,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="text-blue-500 text-sm font-medium mt-4">
                  <span
                    onClick={() => {
                      setSelectedBottomTab("editSelectedPoint");
                      setOpenSideBar(true);
                      setClickedPoint(point);
                    }}
                    className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                  >
                    {content.bottomSection.editPointTabs.editPoint}
                  </span>
                  <span className="mx-2">-</span>
                  <span
                    onClick={() => {
                      setSelectedBottomTab("deletePoint");
                      setOpenSideBar(true);
                      setClickedPoint(point);
                    }}
                    className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                  >
                    {content.bottomSection.editPointTabs.deletePoint}
                  </span>
                  <span className="mx-2">-</span>
                  <span
                    onClick={() => {
                      setSelectedBottomTab("viewPlans");
                      setOpenSideBar(true);
                      setClickedPoint(point);
                    }}
                    className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                  >
                    {content.bottomSection.editPointTabs.viewObservations}
                  </span>
                  <span className="mx-2">-</span>
                  <span
                    onClick={() => {
                      setSelectedBottomTab("addToPlan");
                      setOpenSideBar(true);
                      setClickedPoint(point);
                    }}
                    className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                  >
                    {content.bottomSection.editPointTabs.addToPlan}
                  </span>
                </div>
              </div>
            );
          })}

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
