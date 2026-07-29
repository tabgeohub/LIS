import { useCallback } from "react";
import { useOpenTable } from "hooks/zustand/ui/showTable";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { EnrichedPointType } from "Types";
import useLogAction from "hooks/useLogAction";
import {
  exportPointsPlansCsv,
  exportPointsPlansXlsx,
  exportPointsShapefile,
} from "Components/HomePage/helpers/tableExports/pointsPlansTableExport";
import { useBottomCompactListView } from "hooks/bottom/useBottomCompactListView";
import { zoomMapToPointsTable } from "./zoomMapToPointsTable";

export function usePointsListActions() {
  const logAction = useLogAction();
  const { pointsTable, flightPlans } = useOpenTable();
  const { mapView } = useMapViewState();
  const points = pointsTable as EnrichedPointType[];
  return {
    listView: useBottomCompactListView({
      logMessage: "User clicked 'List view' button",
    }),
    zoomToPoints: useCallback(
      () => zoomMapToPointsTable({ mapView, pointsTable, logAction }),
      [mapView, pointsTable, logAction]
    ),
    exportCsv: useCallback(
      () => exportPointsPlansCsv({ points, plans: flightPlans }),
      [points, flightPlans]
    ),
    exportXlsx: useCallback(
      () => exportPointsPlansXlsx({ points, plans: flightPlans }),
      [points, flightPlans]
    ),
    exportShp: useCallback(
      () => exportPointsShapefile(points),
      [points]
    ),
  };
}
