import { useCallback } from "react";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { MdOutlineZoomOutMap, MdTableChart } from "react-icons/md";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { EnrichedPointType } from "Types";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import { useOpenResultTab } from "@helpers/ZustandStates/showResultTab";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenAllTable } from "@helpers/ZustandStates/showAllTable";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import Polygon from "@arcgis/core/geometry/Polygon";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import {
  exportPointsPlansCsv,
  exportPointsPlansXlsx,
  exportPointsShapefile,
} from "@helpers/tableExports/pointsPlansTableExport";

export default function PointsList() {
  const logAction = useLogAction();
  const { pointsTable, setOpenTable, flightPlans } = useOpenTable();
  const { mapView } = useMapViewState();
  const { setOpenResultTab } = useOpenResultTab();
  const { setOpenSearchedTab } = useOpenSearchedTab();
  const { setOpenAllTable } = useOpenAllTable();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { selectedTab } = useTabState();
  const content = useContent();

  const zoomToPoints = useCallback(() => {
    if (!validateMapView(mapView) || !pointsTable || pointsTable.length === 0) return;

    const lats = pointsTable.map((p) => p.latitude);
    const lons = pointsTable.map((p) => p.longitude);
    const polygon = new Polygon({
      rings: [
        [
          [Math.min(...lons), Math.max(...lats)],
          [Math.max(...lons), Math.max(...lats)],
          [Math.max(...lons), Math.min(...lats)],
          [Math.min(...lons), Math.min(...lats)],
          [Math.min(...lons), Math.max(...lats)],
        ],
      ],
      spatialReference: { wkid: 4326 },
    });

    mapView.goTo(polygon);
    logAction({
      message: "User clicked 'Zoom to all points' button",
      step: "Clicked table functions",
    });
  }, [mapView, pointsTable, logAction]);

  const listView = useCallback(() => {
    if (selectedTab === "none") {
      setSelectedBottomTab("searched");
      setOpenSearchedTab(true);
    } else {
      setSelectedBottomTab("result");
      setOpenResultTab(true);
    }
    setOpenSideBar(true);
    setOpenAllTable(false);
    setOpenTable(false);
    logAction({
      message: "User clicked 'List view' button",
      step: "Clicked table functions",
    });
  }, [
    selectedTab,
    setSelectedBottomTab,
    setOpenSearchedTab,
    setOpenResultTab,
    setOpenSideBar,
    setOpenAllTable,
    setOpenTable,
    logAction,
  ]);

  const exportCsv = useCallback(
    () =>
      exportPointsPlansCsv({
        points: pointsTable as EnrichedPointType[],
        plans: flightPlans,
      }),
    [pointsTable, flightPlans]
  );

  const exportXlsx = useCallback(
    () =>
      exportPointsPlansXlsx({
        points: pointsTable as EnrichedPointType[],
        plans: flightPlans,
      }),
    [pointsTable, flightPlans]
  );

  const exportShp = useCallback(
    () => exportPointsShapefile(pointsTable as EnrichedPointType[]),
    [pointsTable]
  );

  return (
    <div>
      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={listView}
      >
        <MdTableChart className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.bottomSection.pointsList.listView.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.bottomSection.pointsList.listView.subtitle}{" "}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={zoomToPoints}
      >
        <MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.bottomSection.pointsList.zoomToAll.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.bottomSection.pointsList.zoomToAll.subtitle}{" "}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={exportCsv}
      >
        <BsFiletypeCsv className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.bottomSection.pointsList.exportCsv.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.bottomSection.pointsList.exportCsv.subtitle}{" "}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={exportXlsx}
      >
        <BsFiletypeXlsx className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.bottomSection.pointsList.exportXlsx.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.bottomSection.pointsList.exportXlsx.subtitle}{" "}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={exportShp}
      >
        <BsFiletypeJson className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.bottomSection.pointsList.exportShp.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.bottomSection.pointsList.exportShp.subtitle}{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
