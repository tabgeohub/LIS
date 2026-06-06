import dayjs from "dayjs";
import useLogAction from "hooks/useLogAction";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlanMapHighlight } from "hooks/hover-click-handlers/useFinishedPlanMapHighlight";

export default function SinglePlan({ plan }: { plan: FinishedFlightPlanType }) {
  const { selectedPlan, setSelectedPlan } = useCreateReportState();
  const { handleClick, handleHover, handleMouseLeave } =
    useFinishedPlanMapHighlight("createReport");
  const logAction = useLogAction();

  return (
    <div
      onMouseEnter={() => handleHover(plan)}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        handleClick(plan, setSelectedPlan);
        logAction({
          message: "User clicked on a flight plan",
          step: "First step",
          newData: {
            vluchtnummer: plan.vluchtnummer,
            omschrijving: plan.omschrijving,
            waarnemer: plan.waarnemer,
            piloot: plan.piloot,
            datum: plan.datum,
            vliegduur: plan.vliegduur,
            luchtvaartuig: plan.luchtvaartuig,
            passagiers: plan.passagiers,
            hoofdthema: plan.hoofdthema,
            aanvullende: plan.aanvullende,
          },
        });
      }}
      className={`p-2 
        ${plan.status === "in-progress" && "bg-neutral-200"}
        ${selectedPlan === plan && "bg-gray-100"}
        hover:cursor-pointer hover:bg-gray-100 relative`}
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
