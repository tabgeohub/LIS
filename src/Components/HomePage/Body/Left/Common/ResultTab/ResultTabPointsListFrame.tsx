import { ReactNode, useState } from "react";
import { EnrichedPointType } from "Types";
import { useOpenTable } from "hooks/zustand/ui";
import { useResultTabStarredPointActions } from "Components/HomePage/hooks/resultTab/useResultTabStarredPointActions";
import { useResultTabTableView } from "Components/HomePage/hooks/resultTab/useResultTabTableView";
import { useResultTabMoreMenu } from "Components/HomePage/hooks/resultTab/useResultTabMoreMenu";
import ResultTabClickedPointPopup from "./ResultTabClickedPointPopup";
import ResultTabPointRow from "./ResultTabPointRow";
import ResultTabPointsFooter from "./ResultTabPointsFooter";
import ResultTabPointsHeader from "./ResultTabPointsHeader";

type ResultTabPointsListFrameProps = {
  clickedPoint: EnrichedPointType | undefined;
  setClickedPoint: (point: EnrichedPointType | undefined) => void;
  setFase: (value: string) => void;
  summaryText: string;
  pageInfoText: string;
  layout?: "stacked";
  renderRowFooter?: (point: EnrichedPointType) => ReactNode;
};

export default function ResultTabPointsListFrame({
  clickedPoint,
  setClickedPoint,
  setFase,
  summaryText,
  pageInfoText,
  layout,
  renderRowFooter,
}: ResultTabPointsListFrameProps) {
  const [openListPointDiv, setOpenListPointDiv] = useState(false);
  const { pointsTable } = useOpenTable();
  const tableView = useResultTabTableView();
  const actions = useResultTabStarredPointActions();
  const { activePoint, position, popupRef, openMoreMenu } = useResultTabMoreMenu({
    activePoint: clickedPoint,
    setActivePoint: setClickedPoint,
  });

  return (
    <div>
      <ResultTabPointsHeader
        count={pointsTable.length}
        onBack={tableView}
        openListPointDiv={openListPointDiv}
        setOpenListPointDiv={setOpenListPointDiv}
        setFase={setFase}
        starredPoints={actions.starredPoints}
        setStarredPoints={actions.setStarredPoints}
      />

      <div className="relative w-full border rounded shadow">
        {pointsTable.map((point) => (
          <ResultTabPointRow
            key={point.id}
            point={point}
            isStarred={actions.starredPoints.some((item) => item.id === point.id)}
            layout={layout}
            onMouseEnter={() => actions.hoverPoint(point)}
            onMouseLeave={actions.clearHover}
            onRowClick={() => actions.goToPoint(point)}
            onToggleStar={(event) => {
              event.stopPropagation();
              actions.toggleStarPoint(point);
            }}
            onOpenDetails={() => {
              setFase("details");
              setClickedPoint(point);
            }}
            onOpenMoreMenu={(event) => openMoreMenu(point, event)}
            footer={renderRowFooter?.(point)}
          />
        ))}

        {activePoint && position && (
          <ResultTabClickedPointPopup
            clickedPoint={activePoint}
            position={position}
            popupRef={popupRef}
          />
        )}

        <ResultTabPointsFooter
          total={pointsTable.length}
          summaryText={summaryText}
          pageInfoText={pageInfoText}
        />
      </div>
    </div>
  );
}
