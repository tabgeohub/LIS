import dayjs from "dayjs";
import { usePlanClick } from "hooks/hover-click-handlers/usePlanClick";
import usePlanHover from "hooks/hover-click-handlers/usePlanHover";
import useLogAction from "hooks/useLogAction";
import { useDeleteFlightPlan } from "hooks/zustand/useDeleteFlightPlan";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FlightPlanType } from "Types";

export default function SinglePlan({ plan }: { plan: FlightPlanType }) {
  const { handleClick } = usePlanClick();
  const { handleHover, handleMouseLeave } = usePlanHover();

  const { selectedPlan, setSelectedPlan } = useDeleteFlightPlan();

  const logAction = useLogAction();

  return (
    <div
      onClick={() => {
        handleClick(plan, setSelectedPlan);

        logAction({
          message: `User clicked on flight plan ${plan.vluchtnummer} to delete`,
        });
      }}
      onMouseEnter={() => handleHover(plan)}
      onMouseLeave={handleMouseLeave}
      className={`p-2 hover:bg-gray-100 ${
        selectedPlan?.id === plan.id && "bg-gray-200"
      } transition-all cursor-pointer`}
    >
      <div className="flex items-center gap-x-2">
        <FaMapMarkedAlt className="size-6 text-blue-500" />
        <p className="text-[12px]">{plan.vluchtnummer}</p>
      </div>

      <div className="text-[10px] text-gray-500 mt-2">
        <p>Omschrijving: {plan.omschrijving}</p>
        <p>Doel en hoofdthema: {plan.hoofdthema}</p>
        <p>Aanvullende informatie: {plan.aanvullende}</p>
        <p>Inspectiedatum: {dayjs(plan.datum).format("YYYY-MM-DD")}</p>
      </div>
    </div>
  );
}
