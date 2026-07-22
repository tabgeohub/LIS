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
import {
  panMapToFlightPlan,
  zoomMapToFlightPlan,
} from "@helpers/ArcGISHelpers/flightPlanMapActions";
import MenuItem from "Components/HomePage/Body/Bottom/common/MenuItem";

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

  const zoomToPoint = () => zoomMapToFlightPlan({ mapView, flightPlan });
  const goToPoint = () => panMapToFlightPlan({ mapView, flightPlan });

  const { deleteData } = useDeleteData("/flightPlans");

  function handleDeletePlan() {
    deleteData({ id: String(flightPlan?.id) });
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
