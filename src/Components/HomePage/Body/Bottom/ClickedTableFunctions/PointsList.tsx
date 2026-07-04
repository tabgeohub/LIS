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
import BottomTableActionItem from "./BottomTableActionItem";

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

  const list = content.bottomSection.pointsList;

  return (
    <div>
      <BottomTableActionItem
        icon={<MdTableChart />}
        title={list.listView.title}
        subtitle={list.listView.subtitle}
        onClick={listView}
      />
      <BottomTableActionItem
        icon={<MdOutlineZoomOutMap />}
        title={list.zoomToAll.title}
        subtitle={list.zoomToAll.subtitle}
        onClick={zoomToPoints}
      />
      <BottomTableActionItem
        icon={<BsFiletypeCsv />}
        title={list.exportCsv.title}
        subtitle={list.exportCsv.subtitle}
        onClick={exportCsv}
      />
      <BottomTableActionItem
        icon={<BsFiletypeXlsx />}
        title={list.exportXlsx.title}
        subtitle={list.exportXlsx.subtitle}
        onClick={exportXlsx}
      />
      <BottomTableActionItem
        icon={<BsFiletypeJson />}
        title={list.exportShp.title}
        subtitle={list.exportShp.subtitle}
        onClick={exportShp}
      />
    </div>
  );
}
