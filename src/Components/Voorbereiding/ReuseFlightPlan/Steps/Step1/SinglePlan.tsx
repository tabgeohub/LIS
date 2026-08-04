import { usePlanClick } from "hooks/hover-click/usePlanClick";
import usePlanHover from "hooks/hover-click/usePlanHover";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useReuseFlightPlan } from "Components/Voorbereiding/ReuseFlightPlan/useReuseFlightPlan";
import { FlightPlanType } from "Types";
import FlightPlanSummary from "Components/Common/FlightPlanSummary";
import FlightPlanClickableRow from "Components/Common/FlightPlanClickableRow";
import { logFlightPlanRowClick } from "Components/HomePage/Body/Left/Common/logFlightPlanRowClick";

export default function SinglePlan({ plan }: { plan: FlightPlanType }) {
  const { handleClick } = usePlanClick();
  const { handleHover, handleMouseLeave } = usePlanHover();

  const { selectedPlan, setSelectedPlan } = useReuseFlightPlan();

  const logAction = useLogAction();

  const content = useContent();

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
      <FlightPlanSummary
        plan={plan}
        labels={{
          description: content.voorbereiding.vluchtplanHergebruiken.step1.omschrijving,
          theme: content.voorbereiding.vluchtplanHergebruiken.step1.doelEnHoofdthema,
          additional: content.voorbereiding.vluchtplanHergebruiken.step1.aanvullendeInformatie,
          inspectionDate: content.voorbereiding.vluchtplanHergebruiken.step1.inspecteerdatum,
        }}
      />
    </FlightPlanClickableRow>
  );
}
