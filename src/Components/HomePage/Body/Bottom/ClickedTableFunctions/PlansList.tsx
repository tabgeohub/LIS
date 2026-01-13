import Point from "@arcgis/core/geometry/Point";
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
import { EnrichedPointType } from "Types";
import { useDeleteData } from "utils/useDeleteData";

export default function PlansList() {
  const { mapView } = useMapViewState();
  const { flightPlanData: flightPlan, setOpenTable } = useOpenTable();

  const { setOpenResultTab } = useOpenResultTab();

  const { setOpenSearchedTab } = useOpenSearchedTab();

  const { setOpenAllTable } = useOpenAllTable();
  const { setOpenSideBar } = useOpeSideBarState();

  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { selectedTab } = useTabState();

  const computeCentroid = () => {
    if (!flightPlan?.points?.length) return null;

    const coords = flightPlan.points.map((pt: EnrichedPointType) => ({
      x: pt.longitude,
      y: pt.latitude,
    }));

    const sum = coords.reduce(
      (acc, coord) => {
        acc.x += coord.x;
        acc.y += coord.y;
        return acc;
      },
      { x: 0, y: 0 }
    );

    const centerX = sum.x / coords.length;
    const centerY = sum.y / coords.length;

    return new Point({
      longitude: centerX,
      latitude: centerY,
      spatialReference: { wkid: 4326 },
    });
  };

  const zoomToPoint = () => {
    if (mapView && flightPlan) {
      const center = computeCentroid();
      if (center) {
        mapView.goTo({ target: center, zoom: 8 });
      }
    }
  };

  const goToPoint = () => {
    if (mapView && flightPlan) {
      const center = computeCentroid();
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
