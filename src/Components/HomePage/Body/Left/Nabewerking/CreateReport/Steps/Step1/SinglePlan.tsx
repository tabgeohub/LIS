import useLogAction from "hooks/useLogAction";
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlanMapHighlight } from "hooks/hover-click-handlers/useFinishedPlanMapHighlight";
import FlightPlanSummary from "Components/HomePage/Body/Left/Common/FlightPlanSummary";

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
      <FlightPlanSummary plan={plan} />
    </div>
  );
}
