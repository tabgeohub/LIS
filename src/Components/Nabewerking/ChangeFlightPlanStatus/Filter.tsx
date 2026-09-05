import { useChangePlanStatusState } from "Components/Nabewerking/ChangeFlightPlanStatus/useChangePlanStatusState";
import PeriodFilterPanel from "Components/Common/PeriodFilterPanel";

export default function Filter() {
  return <PeriodFilterPanel store={useChangePlanStatusState()} />;
}
