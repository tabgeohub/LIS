import { usePlanClick } from "hooks/hover-click-handlers/usePlanClick";
import usePlanHover from "hooks/hover-click-handlers/usePlanHover";
import useLogAction from "hooks/useLogAction";
import { useChangePlanStatusState } from "hooks/zustand/nabewerking/useChangePlanStatusState";
import { FlightPlanType } from "Types";
import FlightPlanSummary from "Components/HomePage/Body/Left/Common/FlightPlanSummary";

export default function SinglePlan({ plan }: { plan: FlightPlanType }) {
  const logAction = useLogAction();

  const { selectedPlan, setSelectedPlan } = useChangePlanStatusState();

  const { handleHover, handleMouseLeave } = usePlanHover();
  const { handleClick } = usePlanClick();

  return (
    <div
      onClick={() => {
        handleClick(plan, setSelectedPlan);

        logAction({
          message: `User clicked on flight plan : ${selectedPlan?.vluchtnummer}`,
          step: "First step",
        });
      }}
      onMouseEnter={() => handleHover(plan)}
      onMouseLeave={handleMouseLeave}
      className={`p-2 hover:bg-gray-100 ${
        selectedPlan?.id === plan.id && "bg-gray-200"
      } transition-all cursor-pointer`}
    >
      <FlightPlanSummary plan={plan} />
    </div>
  );
}
