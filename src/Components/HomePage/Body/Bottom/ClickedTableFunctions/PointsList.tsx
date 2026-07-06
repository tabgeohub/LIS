import { useCallback } from "react";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { MdOutlineZoomOutMap, MdTableChart } from "react-icons/md";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { EnrichedPointType } from "Types";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import Polygon from "@arcgis/core/geometry/Polygon";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import {
  exportPointsPlansCsv,
  exportPointsPlansXlsx,
  exportPointsShapefile,
} from "@helpers/tableExports/pointsPlansTableExport";
import { useBottomCompactListView } from "hooks/bottom/useBottomCompactListView";
import BottomTableActionItem from "./BottomTableActionItem";

export default function PointsList() {
  const logAction = useLogAction();
  const { pointsTable, setOpenTable, flightPlans } = useOpenTable();
  const { mapView } = useMapViewState();
  const content = useContent();
  const listView = useBottomCompactListView({
    logMessage: "User clicked 'List view' button",
  });

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
