import { useCreateReportState } from "Components/Nabewerking/CreateReport/state/useCreateReportState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlanMapHighlight } from "hooks/hover-click/useFinishedPlanMapHighlight";
import FlightPlanSummary from "Components/Common/FlightPlanSummary";
import { useCreateReportPlanClick } from "./useCreateReportPlanClick";

export default function SinglePlan({ plan }: { plan: FinishedFlightPlanType }) {
  const { selectedPlan, setSelectedPlan } = useCreateReportState();
  const { handleHover, handleMouseLeave } =
    useFinishedPlanMapHighlight("createReport");
  const onClick = useCreateReportPlanClick(plan, setSelectedPlan);

  return (
    <div
      onMouseEnter={() => handleHover(plan)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`p-2 
        ${plan.status === "in-progress" && "bg-neutral-200"}
        ${selectedPlan === plan && "bg-gray-100"}
        hover:cursor-pointer hover:bg-gray-100 relative`}
    >
      <FlightPlanSummary plan={plan} />
    </div>
  );
}
