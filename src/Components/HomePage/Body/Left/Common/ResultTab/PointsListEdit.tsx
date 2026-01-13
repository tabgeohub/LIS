import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useRef, useState } from "react";
import { BsTextParagraph } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TfiMoreAlt } from "react-icons/tfi";
import { EnrichedPointType } from "Types";
import ListPointFunctions from "./ListPointsFunctions";
import { useOpenResultTab } from "@helpers/ZustandStates/showResultTab";
import { useTabState } from "@helpers/ZustandStates/tabState";
import ClickedPointFunctions from "Components/HomePage/Body/Bottom/ClickedPointFunctions";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function PointsListEdit({
  clickedPoint,
  setFase,
  setClickedPointDetails,
}: {
  clickedPoint: EnrichedPointType | undefined;
  setFase: (value: string) => void;
  setClickedPointDetails: (value: EnrichedPointType | undefined) => void;
}) {
  const logAction = useLogAction();

  const [clickedPointPosition, setClickedPointPosition] = useState<{
    top: number;
    left: number;
  }>();
  const [openListPointDiv, setOpenListPointDiv] = useState(false);

  const [starredPoints, setStarredPoints] = useState<EnrichedPointType[]>([]);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const { graphicsLayerHover, mapView, graphicsLayer } = useMapViewState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  const { setOpenSideBar } = useOpeSideBarState();

  const { setClickedPoint } = usePopUpState();

  const { setOpenResultTab } = useOpenResultTab();

  const { setSelectedTab } = useTabState();

  const { pointsTable, setOpenTable, setView } = useOpenTable();

  const hoverPointTable = (point: EnrichedPointType) => {
    const graphic = new Graphic({
      geometry: new Point({
        longitude: point.longitude,
        latitude: point.latitude,
      }),
      symbol: new PictureMarkerSymbol({
        url: "/location-icon.png",
        width: "24px",
        height: "24px",
      }),
    });
    graphicsLayerHover?.add(graphic);
  };

  const goToPoint = (point: EnrichedPointType) => {
    if (mapView) {
      const pt = new Point({
        longitude: point.longitude,
        latitude: point.latitude,
      });
      mapView.goTo(pt);

      logAction({
        message: `User clicked on point '${point.omschrijving}' in the list of starred points`,
        step: "ResultTab ( goToPoint function )",
      });
    }
  };

  const toggleStarPoint = (point: EnrichedPointType) => {
    const alreadyStarred = starredPoints.find((p) => p.id === point.id);

    if (alreadyStarred) {
      setStarredPoints((prev) => prev.filter((p) => p.id !== point.id));
      const toRemove = graphicsLayer?.graphics.find(
        (g) => g.attributes?.id === point.id
      );
      if (toRemove) graphicsLayer?.graphics.remove(toRemove);

      logAction({
        message: `User removed point '${point.omschrijving}' from the list of starred points`,
        step: "ResultTab",
      });
    } else {
      setStarredPoints((prev) => [...prev, point]);

      const graphic = new Graphic({
        geometry: new Point({
          longitude: point.longitude,
          latitude: point.latitude,
        }),
        symbol: new SimpleMarkerSymbol({
          style: "circle",
          size: 14,
          color: [255, 255, 255, 0],
          outline: {
            color: [0, 0, 255, 1],
            width: 2,
          },
        }),
        attributes: { id: point.id },
      });

      graphicsLayer?.graphics.add(graphic);

      logAction({
        message: `User starred point '${point.omschrijving}' in the list of starred points`,
        step: "ResultTab",
      });
    }
  };

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

  const content = useContent();

  return (
    <div>
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
      <div>
        <div className="relative w-full border rounded shadow">
          {pointsTable.map((point) => {
            const isStarred = starredPoints.some((p) => p.id === point.id);
            return (
              <div
                key={point.id}
                className="px-4 py-1 border-b hover:bg-neutral-100"
                onMouseEnter={() => hoverPointTable(point)}
                onMouseLeave={() => graphicsLayerHover?.removeAll()}
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
              {content.bottomSection.pagination.showingResults
                .replace("{start}", String(1))
                .replace("{end}", String(pointsTable.length))
                .replace("{total}", String(pointsTable.length))}
            </span>

            <div className="flex items-center gap-1">
              <button className="text-gray-400 hover:text-gray-600">
                &laquo;
              </button>

              <span>
                {content.bottomSection.pagination.pageInfo
                  .replace("{current}", String(1))
                  .replace("{totalPages}", String(1))}
              </span>

              <button className="text-gray-400 hover:text-gray-600">
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
