import { usePlanClick } from "hooks/hover-click-handlers/usePlanClick";
import usePlanHover from "hooks/hover-click-handlers/usePlanHover";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useReuseFlightPlan } from "hooks/zustand/useReuseFlightPlan";
import { FlightPlanType } from "Types";
import FlightPlanSummary from "Components/HomePage/Body/Left/Common/FlightPlanSummary";

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
      <FlightPlanSummary
        plan={plan}
        labels={{
          description: content.voorbereiding.vluchtplanHergebruiken.step1.omschrijving,
          theme: content.voorbereiding.vluchtplanHergebruiken.step1.doelEnHoofdthema,
          additional: content.voorbereiding.vluchtplanHergebruiken.step1.aanvullendeInformatie,
          inspectionDate: content.voorbereiding.vluchtplanHergebruiken.step1.inspecteerdatum,
        }}
      />
    </div>
  );
}
