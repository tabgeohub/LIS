import Point from "@arcgis/core/geometry/Point";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import { MdDelete, MdOutlineZoomIn, MdOutlineZoomInMap } from "react-icons/md";
import { EnrichedPointType } from "Types";
import { useDeleteData } from "utils/useDeleteData";

export default function ClickedPointFunctions({
  clickedPoint,
}: {
  clickedPoint: EnrichedPointType | undefined;
}) {
  const { pointsTable, setPointsTable } = useOpenTable();

  const { mapView } = useMapViewState();

  const { setPoints } = usePointsStore();

  const { deleteData } = useDeleteData(`/points`);

  const logAction = useLogAction();

  const zoomToPoint = () => {
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
  };

  const goToPoint = () => {
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
  };

  const removePoint = () => {
    if (!clickedPoint) return;

    deleteData(clickedPoint.id, undefined, () => {
      setPointsTable(pointsTable?.filter((p) => p.id !== clickedPoint?.id));
      setPoints(pointsTable?.filter((p) => p.id !== clickedPoint?.id));

      logAction({
        message: `User clicked on 'Verwijderen uit resultaten'`,
        step: "BottomTabs - ClickedPointFunctions",
      });
    });
  };

  const content = useContent();

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

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function MenuItem({ icon, title, description, onClick }: MenuItemProps) {
  return (
    <div
      className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
      onClick={onClick}
    >
      <div>{icon}</div>

      <div>
        <p className="text-[14px] font-semibold text-gray-800">{title}</p>
        <p className="text-[12px] text-gray-500">{description}</p>
      </div>
    </div>
  );
}
