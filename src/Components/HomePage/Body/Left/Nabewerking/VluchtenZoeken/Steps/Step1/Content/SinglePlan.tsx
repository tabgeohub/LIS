import dayjs from "dayjs";
import useLogAction from "hooks/useLogAction";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import { FaMapMarkedAlt } from "react-icons/fa";
import { LuWaypoints } from "react-icons/lu";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlanMapHighlight } from "hooks/hover-click-handlers/useFinishedPlanMapHighlight";

export default function SinglePlan({ plan }: { plan: FinishedFlightPlanType }) {
  const { selectedPlan, setSelectedPlan } = useFinishedPlansState();
  const { handleClick, handleHover, handleMouseLeave } =
    useFinishedPlanMapHighlight("vluchtenZoeken");
  const logAction = useLogAction();

  return (
    <div
      onClick={() => {
        handleClick(plan, setSelectedPlan);
        logAction({
          message: `User clicked on flight plan ${plan.vluchtnummer}`,
          step: "First step",
        });
      }}
      onMouseEnter={() => handleHover(plan)}
      onMouseLeave={handleMouseLeave}
      className={`p-2 hover:bg-gray-100 ${
        selectedPlan?.id === plan.id && "bg-gray-200"
      } transition-all cursor-pointer relative`}
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

      <div className="absolute mt-4 bottom-0 right-4">
        <LuWaypoints className="size-4 text-gray-500" />
        <div className="absolute bottom-2 -right-3 bg-[#3B82F6] rounded-full px-1 text-white text-[10px]">
          {plan.points_data.length + plan.geometries.length}
        </div>
      </div>
    </div>
  );
}
