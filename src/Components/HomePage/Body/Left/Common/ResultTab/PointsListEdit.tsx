import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useState } from "react";
import { EnrichedPointType } from "Types";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useContent } from "hooks/useContent";
import { useResultTabStarredPointActions } from "hooks/resultTab/useResultTabStarredPointActions";
import { useResultTabTableView } from "hooks/resultTab/useResultTabTableView";
import { useResultTabMoreMenu } from "hooks/resultTab/useResultTabMoreMenu";
import ResultTabPointsHeader from "./ResultTabPointsHeader";
import ResultTabPointsFooter from "./ResultTabPointsFooter";
import ResultTabPointRow from "./ResultTabPointRow";
import ResultTabClickedPointPopup from "./ResultTabClickedPointPopup";

export default function PointsListEdit({
  clickedPoint,
  setFase,
  setClickedPointDetails,
}: {
  clickedPoint: EnrichedPointType | undefined;
  setFase: (value: string) => void;
  setClickedPointDetails: (value: EnrichedPointType | undefined) => void;
}) {
  const [openListPointDiv, setOpenListPointDiv] = useState(false);
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
  const { activePoint, position, popupRef, openMoreMenu } = useResultTabMoreMenu({
    activePoint: clickedPoint,
    setActivePoint: setClickedPointDetails,
  });

  const openBottomTab = (tab: string, point: EnrichedPointType) => {
    setSelectedBottomTab(tab);
    setOpenSideBar(true);
    setClickedPoint(point);
  };

  const editTabs = content.bottomSection.editPointTabs;

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
            <ResultTabPointRow
              key={point.id}
              point={point}
              isStarred={isStarred}
              layout="stacked"
              onMouseEnter={() => hoverPoint(point)}
              onMouseLeave={clearHover}
              onRowClick={() => goToPoint(point)}
              onToggleStar={(e) => {
                e.stopPropagation();
                toggleStarPoint(point);
              }}
              onOpenDetails={() => {
                setFase("details");
                setClickedPointDetails(point);
              }}
              onOpenMoreMenu={(e) => openMoreMenu(point, e)}
              footer={
                <div className="text-blue-500 text-sm font-medium mt-4">
                  <span
                    onClick={() => openBottomTab("editSelectedPoint", point)}
                    className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                  >
                    {editTabs.editPoint}
                  </span>
                  <span className="mx-2">-</span>
                  <span
                    onClick={() => openBottomTab("deletePoint", point)}
                    className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                  >
                    {editTabs.deletePoint}
                  </span>
                  <span className="mx-2">-</span>
                  <span
                    onClick={() => openBottomTab("viewPlans", point)}
                    className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                  >
                    {editTabs.viewObservations}
                  </span>
                  <span className="mx-2">-</span>
                  <span
                    onClick={() => openBottomTab("addToPlan", point)}
                    className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
                  >
                    {editTabs.addToPlan}
                  </span>
                </div>
              }
            />
          );
        })}

        {activePoint && position && (
          <ResultTabClickedPointPopup
            clickedPoint={activePoint}
            position={position}
            popupRef={popupRef}
          />
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
