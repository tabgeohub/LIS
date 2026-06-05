/* eslint-disable react-hooks/exhaustive-deps */
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import {
  YELLOW_MARKER_SYMBOL,
  STARRED_POINT_SYMBOL,
} from "@helpers/ArcGISHelpers/createSymbols";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useStarredAll } from "@helpers/ZustandStates/starredAll";
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

  const { graphicsLayerHover, mapView, graphicsLayer, yellowGraphicsLayer } =
    useMapViewState();

  const { setSelectedBottomTab } = useSelectedBottomTabState();

  const { setOpenSideBar } = useOpeSideBarState();

  const { setClickedPoint } = usePopUpState();

  const hasRunFilter = useRef(false);
  const hasRunStar = useRef(false);

  useEffect(() => {
    if (pointsData.length > 0 && !hasRunFilter.current) {
      hasRunFilter.current = true;

      pointsData.forEach((point) => {
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
              color: [255, 255, 0, 1],
              width: 4,
            },
          }),
          attributes: { id: point.id },
        });

        graphicsLayer?.graphics.add(graphic);
      });
    }
  }, []);

  useEffect(() => {
    if (starredAll && !hasRunStar.current) {
      hasRunStar.current = true;

      if (!graphicsLayer) return;

      const newStars = pointsData.filter(
        (point) => !starredPoints.some((p) => p.id === point.id)
      );

      const combined = [...starredPoints, ...newStars];
      const unique = Array.from(
        new Map(combined.map((p) => [p.id, p])).values()
      );
      setStarredPoints(unique);

      newStars.forEach((point) => {
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

        graphicsLayer.graphics.add(graphic);
      });
    }
  }, [starredAll]);

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
    }
  };

  const toggleStarPoint = (point: EnrichedPointType) => {
    if (!graphicsLayer) return;
    const alreadyStarred = starredPoints.find((p) => p.id === point.id);

    if (alreadyStarred) {
      setStarredPoints((prev) => prev.filter((p) => p.id !== point.id));
      const toRemove = graphicsLayer?.graphics.find(
        (g) => g.attributes?.id === point.id
      );
      if (toRemove)
        graphicsLayer.graphics.removeMany(
          graphicsLayer.graphics.filter((g) => g.attributes?.id === point.id)
        );
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
    }
  };

  useEffect(() => {
    graphicsLayer?.removeAll();
    yellowGraphicsLayer?.graphics.removeAll();
    if (!validateMapView(mapView, yellowGraphicsLayer)) return;

    pointsData.forEach((point) => {
      if (!point) return;

      const geometry = new Point({
        longitude: point.longitude,
        latitude: point.latitude,
        spatialReference: { wkid: 4326 },
      });

      const graphic = new Graphic({
        geometry,
        symbol: YELLOW_MARKER_SYMBOL,
        attributes: point,
      });

      yellowGraphicsLayer?.add(graphic);

      const alreadyStarred = starredPoints.find((p) => p.id === point.id);

      if (alreadyStarred) {
        const graphic = new Graphic({
          geometry: new Point({
            longitude: point.longitude,
            latitude: point.latitude,
          }),
          symbol: STARRED_POINT_SYMBOL,
          attributes: { id: point.id },
        });

        graphicsLayer?.graphics.add(graphic);
      }
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
