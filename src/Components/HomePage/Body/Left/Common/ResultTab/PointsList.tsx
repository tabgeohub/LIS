import { useState } from "react";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useResultTabStarredPointActions } from "hooks/resultTab/useResultTabStarredPointActions";
import { useResultTabTableView } from "hooks/resultTab/useResultTabTableView";
import { useResultTabMoreMenu } from "hooks/resultTab/useResultTabMoreMenu";
import { EnrichedPointType } from "Types";
import ResultTabPointsHeader from "./ResultTabPointsHeader";
import ResultTabPointsFooter from "./ResultTabPointsFooter";
import ResultTabPointRow from "./ResultTabPointRow";
import ResultTabClickedPointPopup from "./ResultTabClickedPointPopup";

export default function PointsList({
  clickedPoint,
  setFase,
  setClickedPoint,
}: {
  clickedPoint: EnrichedPointType | undefined;
  setFase: (value: string) => void;
  setClickedPoint: (value: EnrichedPointType | undefined) => void;
}) {
  const [openListPointDiv, setOpenListPointDiv] = useState(false);
  const { pointsTable } = useOpenTable();
  const tableView = useResultTabTableView();
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
              onMouseEnter={() => hoverPoint(point)}
              onMouseLeave={clearHover}
              onRowClick={() => goToPoint(point)}
              onToggleStar={(e) => {
                e.stopPropagation();
                toggleStarPoint(point);
              }}
              onOpenDetails={() => {
                setFase("details");
                setClickedPoint(point);
              }}
              onOpenMoreMenu={(e) => openMoreMenu(point, e)}
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
          summaryText="Weergeven resultaat {start} - {end} (Totaal: {total})"
          pageInfoText="Pagina {current} van {totalPages}"
        />
      </div>
    </div>
  );
}
