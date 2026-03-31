import { useEffect, useMemo } from "react";
import { LuWaypoints } from "react-icons/lu";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { TbPolygon, TbLine } from "react-icons/tb";
import { FaMapPin } from "react-icons/fa";
import { getPointCoordinates } from "@helpers/ArcGISHelpers/createPointGraphic";
import { FinishedGeometryType, FinishedPointType } from "Types/finished_plans";
import {
  buildListItems,
  clearRightListHover,
  collectSelectedData,
  drawGeometryHoverSkyBlue,
  drawHoverPin,
} from "./helpers/selectedPlansPointsListHelpers";

export default function SelectedPlansPointsList() {
  const { plans, selectedPlanIds } = useTimesliderState();
  const { graphicsLayerHover } = useMapViewState();
  const { points, geometries } = useMemo(
    () => collectSelectedData(plans, selectedPlanIds),
    [plans, selectedPlanIds]
  );
  const listItems = useMemo(() => buildListItems(points, geometries), [points, geometries]);

  const noResults = listItems.length === 0;

  useEffect(() => {
    return () => {
      if (graphicsLayerHover) clearRightListHover(graphicsLayerHover);
    };
  }, [graphicsLayerHover]);

  const handlePointHover = (point: FinishedPointType) => {
    if (!graphicsLayerHover) return;
    clearRightListHover(graphicsLayerHover);

    const coords = getPointCoordinates(point, true);
    if (!coords) return;

    drawHoverPin(graphicsLayerHover, coords.longitude, coords.latitude, point.id);
  };

  const handleGeometryHover = (geometry: FinishedGeometryType) => {
    if (!graphicsLayerHover) return;
    clearRightListHover(graphicsLayerHover);
    drawGeometryHoverSkyBlue(graphicsLayerHover, geometry);
  };

  const handleHoverLeave = () => {
    if (!graphicsLayerHover) return;
    clearRightListHover(graphicsLayerHover);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b bg-gray-50 shrink-0">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <LuWaypoints className="size-4 text-primary" />
          Points and Geometries ({listItems.length})
        </h3>
      </div>
      <div className="flex-1 overflow-auto">
        {noResults ? (
          <p className="text-[12px] text-gray-400 px-3 py-4">
            Selecteer vluchtplannen om points en geometries te tonen.
          </p>
        ) : (
          <div className="divide-y">
            {listItems.map((item) => {
              if (item.type === "point") {
                const { point, vluchtnummer } = item;
                return (
                  <div
                    key={item.key}
                    onMouseEnter={() => handlePointHover(point)}
                    onMouseLeave={handleHoverLeave}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <FaMapPin className="size-4 text-primary mt-0.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-gray-800 truncate">
                          {point.omschrijving || `Punt ${point.id}`}
                        </p>
                        <p className="text-[10px] text-gray-500">{vluchtnummer}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              const { geometry, vluchtnummer, geometryLabel } = item;
              const isPolygon = (geometry.geometry_type || "")
                .toLowerCase()
                .includes("polygon");

              return (
                <div
                  key={item.key}
                  onMouseEnter={() => handleGeometryHover(geometry)}
                  onMouseLeave={handleHoverLeave}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    {isPolygon ? (
                      <TbPolygon className="size-4 text-yellow-500 mt-0.5 shrink-0" />
                    ) : (
                      <TbLine className="size-4 text-green-500 mt-0.5 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-gray-800 truncate">
                        {geometryLabel}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {vluchtnummer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
