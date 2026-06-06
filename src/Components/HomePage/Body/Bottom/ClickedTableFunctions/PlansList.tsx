import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenAllTable } from "@helpers/ZustandStates/showAllTable";
import { useOpenResultTab } from "@helpers/ZustandStates/showResultTab";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useContent } from "hooks/useContent";
import {
  MdListAlt,
  MdOutlineZoomIn,
  MdOutlineZoomInMap,
  MdDelete,
} from "react-icons/md";
import { useDeleteData } from "utils/useDeleteData";
import MenuItem from "../common/MenuItem";
import { computeFlightPlanCentroid } from "@helpers/ArcGISHelpers/computeFlightPlanCentroid";
import { getFlightPlanPoints } from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";

export default function PlansList() {
  const { mapView } = useMapViewState();
  const { flightPlanData: flightPlan, setOpenTable } = useOpenTable();

  const { setOpenResultTab } = useOpenResultTab();

  const { setOpenSearchedTab } = useOpenSearchedTab();

  const { setOpenAllTable } = useOpenAllTable();
  const { setOpenSideBar } = useOpeSideBarState();

  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { selectedTab } = useTabState();

  const getPlanCenter = () =>
    flightPlan ? computeFlightPlanCentroid(getFlightPlanPoints(flightPlan)) : null;

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

  const listView = () => {
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
  };

  const content = useContent();

  return (
    <div className="absolute top-10 right-0 z-10 bg-white rounded-md shadow-md w-80 max-h-[calc(100vh-120px)] overflow-y-auto border border-gray-300 thin-scrollbar">
      <MenuItem
        icon={<MdListAlt className="text-2xl text-primary mt-1" />}
        title={content.bottomSection.plansList.compactView.title}
        description={content.bottomSection.plansList.compactView.description}
        onClick={listView}
      />

      <MenuItem
        icon={<MdOutlineZoomIn className="text-2xl text-primary mt-1" />}
        title={content.bottomSection.plansList.zoomToObject.title}
        description={content.bottomSection.plansList.zoomToObject.description}
        onClick={zoomToPoint}
      />

      <MenuItem
        icon={<MdOutlineZoomInMap className="text-2xl text-primary mt-1" />}
        title={content.bottomSection.plansList.panToObject.title}
        description={content.bottomSection.plansList.panToObject.description}
        onClick={goToPoint}
      />

      <MenuItem
        icon={<MdDelete className="text-2xl text-primary mt-1" />}
        title={content.bottomSection.plansList.removeFromResults.title}
        description={
          content.bottomSection.plansList.removeFromResults.description
        }
        onClick={handleDeletePlan}
      />
    </div>
  );
}
