import { usePlanClick } from "hooks/hover-click-handlers/usePlanClick";
import usePlanHover from "hooks/hover-click-handlers/usePlanHover";
import useLogAction from "hooks/useLogAction";
import { useChangePlanStatusState } from "hooks/zustand/nabewerking/useChangePlanStatusState";
import { FlightPlanType } from "Types";
import FlightPlanSummary from "Components/HomePage/Body/Left/Common/FlightPlanSummary";
import FlightPlanClickableRow from "Components/HomePage/Body/Left/Common/FlightPlanClickableRow";
import { logFlightPlanRowClick } from "Components/HomePage/Body/Left/Common/logFlightPlanRowClick";

export default function SinglePlan({ plan }: { plan: FlightPlanType }) {
  const logAction = useLogAction();

  const { selectedPlan, setSelectedPlan } = useChangePlanStatusState();

  const { handleHover, handleMouseLeave } = usePlanHover();
  const { handleClick } = usePlanClick();

  return (
    <FlightPlanClickableRow
      selected={selectedPlan?.id === plan.id}
      onClick={() => {
        handleClick(plan, setSelectedPlan);
        logFlightPlanRowClick(logAction, plan.vluchtnummer);
      }}
      onMouseEnter={() => handleHover(plan)}
      onMouseLeave={handleMouseLeave}
    >
      <FlightPlanSummary plan={plan} />
    </FlightPlanClickableRow>
  );
}
