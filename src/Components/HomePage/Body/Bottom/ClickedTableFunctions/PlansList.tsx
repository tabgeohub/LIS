import { useMapViewState } from "hooks/zustand/ui";
import { useOpenTable } from "hooks/zustand/ui";
import { useContent } from "hooks/useContent";
import {
  MdListAlt,
  MdOutlineZoomIn,
  MdOutlineZoomInMap,
  MdDelete,
} from "react-icons/md";
import { useDeleteData } from "api-hooks/mutations";
import MenuItem from "../common/MenuItem";
import {
  panMapToFlightPlan,
  zoomMapToFlightPlan,
} from "@helpers/ArcGISHelpers/flightPlanMapActions";
import { useBottomCompactListView } from "Components/HomePage/hooks/bottom/useBottomCompactListView";

export default function PlansList() {
  const { mapView } = useMapViewState();
  const { flightPlanData: flightPlan } = useOpenTable();
  const listView = useBottomCompactListView();

  const zoomToPoint = () => {
    if (flightPlan) {
      zoomMapToFlightPlan({ mapView, flightPlan });
    }
  };

  const goToPoint = () => {
    if (flightPlan) {
      panMapToFlightPlan({ mapView, flightPlan });
    }
  };

  const { deleteData } = useDeleteData("/flightPlans");

  function handleDeletePlan() {
    deleteData({ id: String(flightPlan?.id) });
  }

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
