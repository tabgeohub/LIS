import { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { TfiMoreAlt } from "react-icons/tfi";
import { EnrichedPointType } from "Types";
import ClickedPointFunctions from "Components/HomePage/Body/Bottom/ClickedPointFunctions";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useResultTabStarredPointActions } from "hooks/resultTab/useResultTabStarredPointActions";
import { useResultTabTableView } from "hooks/resultTab/useResultTabTableView";
import ResultTabPointsHeader from "./ResultTabPointsHeader";
import ResultTabPointsFooter from "./ResultTabPointsFooter";

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

  const [clickedPointPosition, setClickedPointPosition] = useState<{
    top: number;
    left: number;
  }>();

  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setClickedPoint(undefined);
        setClickedPointPosition(undefined);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleScrollOrResize = () => setClickedPointPosition(undefined);
    window.addEventListener("scroll", handleScrollOrResize);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

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
              className="flex items-center justify-between px-4 py-1 border-b hover:bg-neutral-100"
              onMouseEnter={() => hoverPoint(point)}
              onMouseLeave={clearHover}
              onClick={() => goToPoint(point)}
            >
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
                <span className="my-auto">
                  <IoIosArrowForward
                    className="text-gray-500 my-auto"
                    onClick={() => {
                      setFase("details");
                      setClickedPoint(point);
                    }}
                  />
                </span>
                <span className="text-gray-500 my-auto text-xl font-bold">|</span>
                <TfiMoreAlt
                  className="text-gray-500 my-auto"
                  onClick={(e) => {
                    setClickedPoint(point);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setClickedPointPosition({
                      top: rect.bottom,
                      left: rect.left,
                    });
                  }}
                />
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
          summaryText="Weergeven resultaat {start} - {end} (Totaal: {total})"
          pageInfoText="Pagina {current} van {totalPages}"
        />
      </div>
    </div>
  );
}
