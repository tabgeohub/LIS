import Point from "@arcgis/core/geometry/Point";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { MdDelete, MdOutlineZoomIn, MdOutlineZoomInMap } from "react-icons/md";
import { EnrichedPointType, FlightPlanType } from "Types";

export default function ClickedPlan({
  flightPlan,
}: {
  flightPlan: FlightPlanType;
}) {
  const logAction = useLogAction();

  const { mapView } = useMapViewState();

  const computeCentroid = (): Point | null => {
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
      const center = computeCentroid();
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
