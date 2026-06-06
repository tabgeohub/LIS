import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useContent } from "hooks/useContent";
import {
  MdOutlineViewList,
  MdOutlineZoomIn,
  MdOutlineZoomInMap,
  MdDelete,
} from "react-icons/md";
import { FlightPlanType } from "Types";
import { useDeleteData } from "utils/useDeleteData";
import { computeFlightPlanCentroid } from "@helpers/ArcGISHelpers/computeFlightPlanCentroid";
import { getFlightPlanPoints } from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";

export default function DropDown({
  flightPlan,
}: {
  flightPlan: FlightPlanType;
}) {
  const { setOpenTable, setView, setFlightPlanData } = useOpenTable();
  const { mapView } = useMapViewState();

  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setOpenSideBar } = useOpeSideBarState();

  const tableView = () => {
    setOpenTable(true);
    setView("flightPlans");
    setSelectedBottomTab("topTabs");
    setFlightPlanData(flightPlan);
    setOpenSideBar(false);
  };

  const getPlanCenter = () =>
    computeFlightPlanCentroid(getFlightPlanPoints(flightPlan));

  const zoomToPoint = () => {
    if (mapView && flightPlan) {
      const center = getPlanCenter();
      if (center) {
        mapView.goTo({ target: center, zoom: 8 });
      }
    }
  };

  const goToPoint = () => {
    if (mapView && flightPlan) {
      const center = getPlanCenter();
      if (center) {
        mapView.goTo(center);
      }
    }
  };

  const { deleteData } = useDeleteData("/flightPlans");

  function handleDeletePlan() {
    deleteData(String(flightPlan?.id));
  }

  const content = useContent();

  return (
    <div className="absolute top-10 right-0 z-10 bg-white rounded-md shadow-md w-[350px] max-h-[330px] overflow-y-auto border border-gray-300 thin-scrollbar">
      <MenuItem
        icon={<MdOutlineViewList className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.plansList.expandedView.title}
        description={
          content.layout.searchResult.plansList.expandedView.description
        }
        onClick={tableView}
      />

      <MenuItem
        icon={<MdOutlineZoomIn className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.plansList.zoomToObject.title}
        description={
          content.layout.searchResult.plansList.zoomToObject.description
        }
        onClick={zoomToPoint}
      />

      <MenuItem
        icon={<MdOutlineZoomInMap className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.plansList.panToObject.title}
        description={
          content.layout.searchResult.plansList.panToObject.description
        }
        onClick={goToPoint}
      />

      <MenuItem
        icon={<MdDelete className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.plansList.removeFromResults.title}
        description={
          content.layout.searchResult.plansList.removeFromResults.description
        }
        onClick={handleDeletePlan}
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
