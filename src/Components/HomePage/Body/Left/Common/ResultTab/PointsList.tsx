import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useEffect, useRef, useState } from "react";
import { BsTextParagraph } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiMoreAlt } from "react-icons/tfi";
import { EnrichedPointType } from "Types";
import ListPointFunctions from "./ListPointsFunctions";
import { useOpenResultTab } from "@helpers/ZustandStates/showResultTab";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import ClickedPointFunctions from "Components/HomePage/Body/Bottom/ClickedPointFunctions";
import useLogAction from "hooks/useLogAction";
import usePointListMapActions from "hooks/hover-click-handlers/usePointListMapActions";

export default function PointsList({
  clickedPoint,
  setFase,
  setClickedPoint,
}: {
  clickedPoint: EnrichedPointType | undefined;
  setFase: (value: string) => void;
  setClickedPoint: (value: EnrichedPointType | undefined) => void;
}) {
  const logAction = useLogAction();

  const [openListPointDiv, setOpenListPointDiv] = useState(false);
  const { setOpenResultTab } = useOpenResultTab();

  const { setSelectedTab } = useTabState();

  const { setSelectedBottomTab } = useSelectedBottomTabState();

  const { pointsTable, setOpenTable, setView } = useOpenTable();
  const [starredPoints, setStarredPoints] = useState<EnrichedPointType[]>([]);
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
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
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

  const { hoverPoint, clearHover, goToPoint, toggleStarPoint } =
    usePointListMapActions({
      starredPoints,
      setStarredPoints,
      onStar: (point) => {
        logAction({
          message: `User starred point '${point.omschrijving}' in the list of starred points`,
          step: "ResultTab",
        });
      },
      onUnstar: (point) => {
        logAction({
          message: `User removed point '${point.omschrijving}' from the list of starred points`,
          step: "ResultTab",
        });
      },
      onGoTo: (point) => {
        logAction({
          message: `User clicked on point '${point.omschrijving}' in the list of starred points`,
          step: "ResultTab ( goToPoint function )",
        });
      },
    });

  const tableView = () => {
    setOpenResultTab(false);
    setSelectedBottomTab("topTabs");
    setView("points");
    setSelectedTab("viewPlan");
    setOpenTable(true);

    logAction({
      message: "User changed view to 'Points' in the 'ResultTab' component",
      step: "ResultTab",
    });
  };

  return (
    <div>
      <>
        <div className="relative flex items-center justify-center my-2">
          <button
            className="bg-transparent text-gray-500 text-lg font-bold absolute left-2 -top-1"
            onClick={tableView}
          >
            <IoIosArrowBack className="mt-2" />
          </button>

          <h4 className="text-md text-gray-400">
            Resultaten ({pointsTable.length})
          </h4>
          <button
            className="bg-transparent text-gray-500 text-lg font-bold absolute right-2 -top-1"
            onClick={() => setOpenListPointDiv(!openListPointDiv)}
          >
            <BsTextParagraph className="mt-2" />
          </button>
          {openListPointDiv && (
            <div className="absolute right-2 top-[130%] z-50 max-h-[400px] overflow-y-scroll">
              <ListPointFunctions
                setStarredPoints={setStarredPoints}
                starredPoints={starredPoints}
                setOpenListPointDiv={setOpenListPointDiv}
                setFase={setFase}
              />
            </div>
          )}
        </div>
      </>
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
                <span className="text-gray-500 my-auto text-xl font-bold">
                  |
                </span>
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

        <div className="px-4 py-2 text-sm text-gray-700 flex justify-between items-center border-t">
          <span>
            Weergeven resultaat 1 - {pointsTable.length} (Totaal:{" "}
            {pointsTable.length})
          </span>
          <div className="flex items-center gap-1">
            <button className="text-gray-400 hover:text-gray-600">
              &laquo;
            </button>
            <span>Pagina 1 van 1</span>
            <button className="text-gray-400 hover:text-gray-600">
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
