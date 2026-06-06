import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { MdDelete, MdOutlineZoomIn, MdOutlineZoomInMap } from "react-icons/md";
import { FlightPlanType } from "Types";
import { computeFlightPlanCentroid } from "@helpers/ArcGISHelpers/computeFlightPlanCentroid";
import { getFlightPlanPoints } from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";

export default function ClickedPlan({
  flightPlan,
}: {
  flightPlan: FlightPlanType;
}) {
  const logAction = useLogAction();

  const { mapView } = useMapViewState();

  const getPlanCenter = () =>
    computeFlightPlanCentroid(getFlightPlanPoints(flightPlan));

  const zoomToPoint = () => {
    if (mapView && flightPlan) {
      const center = getPlanCenter();
      if (center) {
        mapView.goTo({ target: center, zoom: 8 });

        logAction({
          message: "User clicked 'Zoom to point' button to zoom to the plan",
          newData: {
            vluchtnummer: flightPlan.vluchtnummer,
            planId: flightPlan.id,
            centerOfPlan: center,
          },
        });
      }
    }
  };

  const goToPoint = () => {
    if (mapView && flightPlan) {
      const center = getPlanCenter();
      if (center) {
        mapView.goTo(center);

        logAction({
          message: "User clicked 'Go to point' button to go to the plan",
          newData: {
            vluchtnummer: flightPlan.vluchtnummer,
            planId: flightPlan.id,
            centerOfPlan: center,
          },
        });
      }
    }
  };

  const removePoint = () => {};

  const content = useContent();

  return (
    <div>
      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={zoomToPoint}
      >
        <MdOutlineZoomIn className="text-primary text-2xl" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.plansList.expandedView.title}
          </p>

          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.plansList.expandedView.description}
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={goToPoint}
      >
        <MdOutlineZoomInMap className="text-primary text-2xl" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.plansList.zoomToObject.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.plansList.zoomToObject.description}
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={removePoint}
      >
        <MdDelete className="text-primary text-2xl" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.plansList.removeFromResults.title}
          </p>

          <p className="text-[12px] text-gray-500">
            {
              content.layout.searchResult.plansList.removeFromResults
                .description
            }
          </p>
        </div>
      </div>
    </div>
  );
}
