import { useOpeSideBarState } from "hooks/zustand/ui/openSideBar";
import { usePopUpState } from "hooks/zustand/ui/popUpState";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { EnrichedPointType } from "Types";
import { useContent } from "hooks/useContent";
import ResultTabPointsListFrame from "./ResultTabPointsListFrame";

export default function PointsListEdit({
  clickedPoint,
  setFase,
  setClickedPointDetails,
}: {
  clickedPoint: EnrichedPointType | undefined;
  setFase: (value: string) => void;
  setClickedPointDetails: (value: EnrichedPointType | undefined) => void;
}) {
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setClickedPoint } = usePopUpState();
  const content = useContent();
  const editTabs = content.bottomSection.editPointTabs;

  const openBottomTab = (tab: string, point: EnrichedPointType) => {
    setSelectedBottomTab(tab);
    setOpenSideBar(true);
    setClickedPoint(point);
  };

  const renderRowFooter = (point: EnrichedPointType) => (
    <div className="text-blue-500 text-sm font-medium mt-4">
      {[
        ["editSelectedPoint", editTabs.editPoint],
        ["deletePoint", editTabs.deletePoint],
        ["viewPlans", editTabs.viewObservations],
        ["addToPlan", editTabs.addToPlan],
      ].map(([tab, label], index) => (
        <span key={tab}>
          {index > 0 && <span className="mx-2">-</span>}
          <span
            onClick={() => openBottomTab(tab, point)}
            className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
          >
            {label}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <ResultTabPointsListFrame
      clickedPoint={clickedPoint}
      setClickedPoint={setClickedPointDetails}
      setFase={setFase}
      summaryText={content.bottomSection.pagination.showingResults}
      pageInfoText={content.bottomSection.pagination.pageInfo}
      layout="stacked"
      renderRowFooter={renderRowFooter}
    />
  );
}
