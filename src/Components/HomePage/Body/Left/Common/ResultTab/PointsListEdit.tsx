import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useRef, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { TfiMoreAlt } from "react-icons/tfi";
import { EnrichedPointType } from "Types";
import ClickedPointFunctions from "Components/HomePage/Body/Bottom/ClickedPointFunctions";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useContent } from "hooks/useContent";
import { useResultTabStarredPointActions } from "hooks/resultTab/useResultTabStarredPointActions";
import { useResultTabTableView } from "hooks/resultTab/useResultTabTableView";
import ResultTabPointsHeader from "./ResultTabPointsHeader";
import ResultTabPointsFooter from "./ResultTabPointsFooter";

export default function PointsListEdit({
  clickedPoint,
  setFase,
  setClickedPointDetails,
}: {
  clickedPoint: EnrichedPointType | undefined;
  setFase: (value: string) => void;
  setClickedPointDetails: (value: EnrichedPointType | undefined) => void;
}) {
  const [clickedPointPosition, setClickedPointPosition] = useState<{
    top: number;
    left: number;
  }>();
  const [openListPointDiv, setOpenListPointDiv] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setClickedPoint } = usePopUpState();
  const { pointsTable } = useOpenTable();
  const tableView = useResultTabTableView();
  const content = useContent();
  const {
    starredPoints,
    setStarredPoints,
    hoverPoint,
    clearHover,
    goToPoint,
    toggleStarPoint,
  } = useResultTabStarredPointActions();

  const openBottomTab = (tab: string, point: EnrichedPointType) => {
    setSelectedBottomTab(tab);
    setOpenSideBar(true);
    setClickedPoint(point);
  };

  return (
    <div>
      <ResultTabPointsHeader
        count={pointsTable.length}
        onBack={tableView}
        openListPointDiv={openListPointDiv}
        setOpenListPointDiv={setOpenListPointDiv}
        setFase={setFase}
        starredPoints={starredPoints}
        setStarredPoints={setStarredPoints}
      />

      <div className="relative w-full border rounded shadow">
        {pointsTable.map((point) => {
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
                  <span className="text-gray-500 my-auto text-xl font-bold">|</span>
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
                  onClick={() => openBottomTab("editSelectedPoint", point)}
                  className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                >
                  {content.bottomSection.editPointTabs.editPoint}
                </span>
                <span className="mx-2">-</span>
                <span
                  onClick={() => openBottomTab("deletePoint", point)}
                  className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                >
                  {content.bottomSection.editPointTabs.deletePoint}
                </span>
                <span className="mx-2">-</span>
                <span
                  onClick={() => openBottomTab("viewPlans", point)}
                  className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                >
                  {content.bottomSection.editPointTabs.viewObservations}
                </span>
                <span className="mx-2">-</span>
                <span
                  onClick={() => openBottomTab("addToPlan", point)}
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
            className="fixed bg-white max-w-[250px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-50"
            style={{
              top: clickedPointPosition.top - 30,
              left: clickedPointPosition.left + 30,
            }}
          >
            <ClickedPointFunctions clickedPoint={clickedPoint} />
          </div>
        )}

        <ResultTabPointsFooter
          total={pointsTable.length}
          summaryText={content.bottomSection.pagination.showingResults}
          pageInfoText={content.bottomSection.pagination.pageInfo}
        />
      </div>
    </div>
  );
}
