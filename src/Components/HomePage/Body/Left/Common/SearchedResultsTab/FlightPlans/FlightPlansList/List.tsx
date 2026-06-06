import { IoIosArrowForward } from "react-icons/io";
import { TfiMoreAlt } from "react-icons/tfi";
import ClickedPlan from "./ClickedPlan";
import { FlightPlanType } from "Types";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FaStar } from "react-icons/fa6";
import useLogAction from "hooks/useLogAction";
import {
  createPlanBoundingBoxGraphic,
  getFlightPlanPoints,
  PLAN_BOUNDING_BOX_SYMBOLS,
} from "@helpers/ArcGISHelpers/createPlanBoundingBoxGraphic";
import {
  addPlanStarGraphic,
  removePlanStarGraphics,
} from "hooks/hover-click-handlers/usePlanStarGraphic";

export default function List({
  flightPlansData,
  originalGraphicsMap,
  setFlightPlanDetails,
  setClickedPointPosition,
  popupRef,
  clickedPointPosition,
  flightPlan,
  setFlightPlan,
  starredPlans,
  setStarredPlans,
}: {
  flightPlansData: FlightPlanType[];
  originalGraphicsMap: React.MutableRefObject<Map<string, __esri.Graphic>>;
  setFlightPlanDetails: (value: boolean) => void;
  setClickedPointPosition: (value: { top: number; left: number }) => void;
  popupRef: React.MutableRefObject<HTMLDivElement | null>;
  clickedPointPosition: {
    top: number;
    left: number;
  };
  flightPlan: FlightPlanType | null;
  setFlightPlan: (value: FlightPlanType | null) => void;
  starredPlans: FlightPlanType[];
  setStarredPlans: (
    value: FlightPlanType[] | ((prev: FlightPlanType[]) => FlightPlanType[])
  ) => void;
}) {
  const logAction = useLogAction();

  const { graphicsLayerHover, mapView, graphicsLayer, redGraphicsLayer } =
    useMapViewState();

  const HoveredPlan = (plan: FlightPlanType) => {
    if (!mapView || !graphicsLayerHover || !graphicsLayer) return;

    const oldGraphic = originalGraphicsMap.current.get(String(plan.id));
    if (oldGraphic) {
      graphicsLayer.remove(oldGraphic);
    }

    graphicsLayerHover.removeAll();

    const hoverGraphic = createPlanBoundingBoxGraphic(getFlightPlanPoints(plan), {
      symbolOptions: PLAN_BOUNDING_BOX_SYMBOLS.hoverSearchList,
    });

    if (hoverGraphic) {
      graphicsLayerHover.add(hoverGraphic);
    }
  };

  const handleMouseLeave = (plan: FlightPlanType) => {
    if (!graphicsLayer || !graphicsLayerHover) return;

    graphicsLayerHover.removeAll();

    const originalGraphic = originalGraphicsMap.current.get(String(plan.id));
    if (originalGraphic) {
      graphicsLayer.add(originalGraphic);
    }
  };

  const toggleStarPlan = (plan: FlightPlanType) => {
    if (!mapView || !redGraphicsLayer) return;

    const alreadyStarred = starredPlans.find((p) => p.id === plan.id);

    if (alreadyStarred) {
      setStarredPlans((prev) => prev.filter((p) => p.id !== plan.id));
      removePlanStarGraphics(plan.id, redGraphicsLayer);

      logAction({
        message: "User unstarred a flight plan",
        newData: {
          vluchtnummer: plan.vluchtnummer,
          planId: plan.id,
        },
      });
    } else {
      setStarredPlans((prev) => [...prev, plan]);
      addPlanStarGraphic(plan, redGraphicsLayer, "search");

      logAction({
        message: "User starred a flight plan",
        newData: {
          vluchtnummer: plan.vluchtnummer,
          planId: plan.id,
        },
      });
    }
  };

  return (
    <div className="relative w-full text-sm text-gray-400">
      {flightPlansData.map((plan) => {
        const isStarred = starredPlans.some((p) => p.id === plan.id);
        return (
          <div
            key={plan.id}
            onMouseEnter={() => HoveredPlan(plan)}
            onMouseLeave={() => handleMouseLeave(plan)}
          >
            <div className="flex items-center justify-between border-b-[1px] border-gray-100 px-2 py-[2px] hover:bg-blue-100">
              <div className="relative flex items-center gap-2 text-sm font-medium text-gray-800">
                <FaStar
                  className={`cursor-pointer ${
                    isStarred ? "text-blue-500" : "text-gray-400"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStarPlan(plan);
                  }}
                />
                <span>{plan.omschrijving}</span>
              </div>

              <div className="relative flex gap-x-2 my-auto">
                <span className="my-auto">
                  <IoIosArrowForward
                    className="text-gray-500 my-auto cursor-pointer"
                    onClick={() => {
                      setFlightPlanDetails(true);
                      setFlightPlan(plan);
                      graphicsLayer?.removeAll();
                      graphicsLayerHover?.removeAll();

                      logAction({
                        message:
                          "User clicked right arrow icon to open flight plan details",
                        newData: {
                          vluchtnummer: plan.vluchtnummer,
                          planId: plan.id,
                        },
                      });
                    }}
                  />
                </span>
                <span className="text-gray-500 my-auto text-xl font-bold">
                  |
                </span>
                <TfiMoreAlt
                  className="text-gray-500 my-auto cursor-pointer"
                  onClick={(e) => {
                    setFlightPlan(plan);

                    const rect = e.currentTarget.getBoundingClientRect();

                    setClickedPointPosition({
                      top: rect.bottom,
                      left: rect.left,
                    });

                    logAction({
                      message:
                        "User clicked 3 dots icon to open drop down list",
                      newData: {
                        vluchtnummer: plan.vluchtnummer,
                        planId: plan.id,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {clickedPointPosition && (
        <div
          ref={popupRef}
          className="fixed bg-white max-w-[300px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-50"
          style={{
            top: clickedPointPosition.top - 30,
            left: clickedPointPosition.left + 20,
          }}
        >
          <ClickedPlan flightPlan={flightPlan!} />
        </div>
      )}
    </div>
  );
}
