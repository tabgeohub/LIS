import { classNames } from "@helpers/classNames";
import { usePlanClick } from "hooks/hover-click-handlers/usePlanClick";
import usePlanHover from "hooks/hover-click-handlers/usePlanHover";
import useLogAction from "hooks/useLogAction";
import { useDeleteFlightPlan } from "hooks/zustand/useDeleteFlightPlan";
import { FaLock } from "react-icons/fa6";
import { GoCheckCircleFill } from "react-icons/go";
import { TbCancel } from "react-icons/tb";
import { FlightPlanType } from "Types";
import FlightPlanSummary from "Components/HomePage/Body/Left/Common/FlightPlanSummary";

export default function SinglePlan({ plan }: { plan: FlightPlanType }) {
  const { handleClick } = usePlanClick();
  const { handleHover, handleMouseLeave } = usePlanHover();

  const { selectedPlan, setSelectedPlan } = useDeleteFlightPlan();

  const logAction = useLogAction();

  return (
    <div
      onMouseEnter={() => handleHover(plan)}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        handleClick(plan, setSelectedPlan);

        logAction({
          message: `User clicked on flight plan ${plan.vluchtnummer} to delete`,
        });
      }}
      className={classNames(
        "hover:cursor-pointer hover:bg-gray-100 relative p-2",
        selectedPlan?.id === plan.id && " bg-gray-200",
        (plan.status === "in-progress" ||
          plan.status === "finished" ||
          plan.status === "canceled") &&
        " bg-neutral-100 "
      )}
    >
      <FlightPlanSummary plan={plan} />

      {plan.status === "in-progress" && (
        <FaLock className="absolute bottom-2 right-3 text-gray-500" />
      )}

      {plan.status === "finished" && (
        <GoCheckCircleFill className="absolute bottom-2 right-3 text-green-500" />
      )}

      {plan.status === "canceled" && (
        <TbCancel className="absolute bottom-2 right-3 text-red-500" />
      )}
    </div>

  );
}
