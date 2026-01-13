import dayjs from "dayjs";
import { usePlanClick } from "hooks/hover-click-handlers/usePlanClick";
import usePlanHover from "hooks/hover-click-handlers/usePlanHover";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FlightPlanType } from "Types";

export default function SinglePlan({ plan }: { plan: FlightPlanType }) {
  const { handleClick } = usePlanClick();
  const { handleHover, handleMouseLeave } = usePlanHover();

  const { selectedPlan, setSelectedPlan } = useReuseFlightPlan();

  const logAction = useLogAction();

  const content = useContent();

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
      } transition-all cursor-pointer`}
    >
      <div className="flex items-center gap-x-2">
        <FaMapMarkedAlt className="size-6 text-blue-500" />
        <p className="text-[12px]">{plan.vluchtnummer}</p>
      </div>

      <div className="text-[10px] text-gray-500 mt-2">
        <p>
          {content.voorbereiding.vluchtplanHergebruiken.step1.omschrijving}:{" "}
          {plan.omschrijving}
        </p>
        <p>
          {content.voorbereiding.vluchtplanHergebruiken.step1.doelEnHoofdthema}:{" "}
          {plan.hoofdthema}
        </p>
        <p>
          {
            content.voorbereiding.vluchtplanHergebruiken.step1
              .aanvullendeInformatie
          }
          : {plan.aanvullende}
        </p>
        <p>
          {content.voorbereiding.vluchtplanHergebruiken.step1.inspecteerdatum}:{" "}
          {dayjs(plan.datum).format("YYYY-MM-DD")}
        </p>
      </div>
    </div>
  );
}
