import React, { useCallback } from "react";
import Point from "@arcgis/core/geometry/Point";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/features/usePointsStore";
import { MdDelete, MdOutlineZoomIn, MdOutlineZoomInMap } from "react-icons/md";
import { EnrichedPointType } from "Types";
import { useDeleteData } from "utils/useDeleteData";
import MenuItem from "./common/MenuItem";

function ClickedPointFunctions({
  clickedPoint,
}: {
  clickedPoint: EnrichedPointType | undefined;
}) {
  const { pointsTable, setPointsTable } = useOpenTable();

  const { mapView } = useMapViewState();

  const { setPoints } = usePointsStore();

  const { deleteData } = useDeleteData(`/points`);

  const logAction = useLogAction();
  const content = useContent();

  const zoomToPoint = useCallback(() => {
    if (mapView && clickedPoint) {
      mapView.zoom = 15;
      const pt = new Point({
        longitude: clickedPoint.longitude,
        latitude: clickedPoint.latitude,
      });
      mapView.goTo(pt);

      logAction({
        message: `User clicked on 'Zoom naar object'`,
        step: "BottomTabs - ClickedPointFunctions",
      });
    }
  }, [mapView, clickedPoint, logAction]);

  const goToPoint = useCallback(() => {
    if (mapView && clickedPoint) {
      const pt = new Point({
        longitude: clickedPoint.longitude,
        latitude: clickedPoint.latitude,
      });
      mapView.goTo(pt);

      logAction({
        message: `User clicked on 'Verschuif naar object'`,
        step: "BottomTabs - ClickedPointFunctions",
      });
    }
  }, [mapView, clickedPoint, logAction]);

  const removePoint = useCallback(() => {
    if (!clickedPoint) return;

    deleteData(clickedPoint.id, undefined, () => {
      const filteredPoints = pointsTable?.filter((p) => p.id !== clickedPoint?.id);
      setPointsTable(filteredPoints);
      setPoints(filteredPoints);

      logAction({
        message: `User clicked on 'Verwijderen uit resultaten'`,
        step: "BottomTabs - ClickedPointFunctions",
      });
    });
  }, [clickedPoint, pointsTable, deleteData, setPointsTable, setPoints, logAction]);

  return (
    <div>
      <MenuItem
        icon={<MdOutlineZoomIn className="text-2xl text-primary mt-1" />}
        title={
          content.bottomSection.clickedPointFunctions.menu.zoomToObject.title
        }
        description={
          content.bottomSection.clickedPointFunctions.menu.zoomToObject
            .description
        }
        onClick={zoomToPoint}
      />

      <MenuItem
        icon={<MdOutlineZoomInMap className="text-2xl text-primary mt-1" />}
        title={
          content.bottomSection.clickedPointFunctions.menu.panToObject.title
        }
        description={
          content.bottomSection.clickedPointFunctions.menu.panToObject
            .description
        }
        onClick={goToPoint}
      />

      <MenuItem
        icon={<MdDelete className="text-2xl text-primary mt-1" />}
        title={
          content.bottomSection.clickedPointFunctions.menu.removeFromResults
            .title
        }
        description={
          content.bottomSection.clickedPointFunctions.menu.removeFromResults
            .description
        }
        onClick={removePoint}
      />
    </div>
  );
}

export default React.memo(ClickedPointFunctions);
