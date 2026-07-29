import { useCreateReportState } from "Components/HomePage/hooks/zustand/nabewerking/useCreateReportState";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useFinishedPlanMapHighlight } from "Components/HomePage/hooks/hover-click-handlers/useFinishedPlanMapHighlight";
import FlightPlanSummary from "Components/HomePage/Body/Left/Common/FlightPlanSummary";
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
